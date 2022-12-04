---
layout: post
title:  "How to add Readiness Checks for Google App Engine on Django"
categories: cloud enhancement
---
A while ago I was tasked with adding <a href="https://cloud.google.com/appengine/docs/flexible/custom-runtimes/configuring-your-app-with-app-yaml#readiness_checks">readiness checks</a> for a Django App. This wasn't as straight forward as I had hoped, so here's a tutorial for the next person who has to do this.

The very first thing you need to do is add a new <a href="https://docs.djangoproject.com/en/3.0/topics/http/middleware/">Middleware</a>, say, `HealthCheckMiddleware` to your Django app. Adding an API via a middleware and not a view might seem strange at first, but it's important that you do this, because your readiness check must be executed before anything else, including Django's inbuilt middleware chain. The skeleton for the middleware will look like:

{% highlight python %}
class HealthCheckMiddleware:
  def __init__(self, get_response):
      self.get_response = get_response

  def __call__(self, request):
      return self.get_response(request)
{% endhighlight %}

In your <code>settings.py</code>, make sure this middleware is executed before everything else by adding it to the top of the list of the middlewares:

{% highlight python %}
MIDDLEWARE = [
  'path.to.HealthCheckMiddleware',
  'django.middleware.common.CommonMiddleware',
    .
    .
    .
  ]
{% endhighlight %}

The next step is to write code to handle the request itself in the middleware. Readiness usually means that your app is up and can connect to the database. Since this API is going to be called pretty frequently by App Engine, we need to make sure the operation is as light as possible:

{% highlight python %}
def __call__(self, request, conn=None):  # conn allow tests to pass custom db conn objects to test failures
  if request.method == "GET":
      if request.path == "/readiness_check/":
          try:  # try to connect to the database
              if not conn:
                  from django.db import connection as conn
              cursor = conn.cursor()
              cursor.execute("SELECT 1;")
              row = cursor.fetchone()
              if row is None:
                  return HttpResponse(503)
              return HttpResponse(status=200)  # No errors, return 200 OK

          except Exception:  # Any error while connecting, return 503
              return HttpResponse(status=503)

return self.get_response(request)
{% endhighlight %}

The final step is to tell Google App Engine how and when to call this API. Add the following to your `app.yaml`:

{% highlight yaml %}
readiness_check:
path: "/readiness_check/"
check_interval_sec: 5
timeout_sec: 4
failure_threshold: 2
success_threshold: 2
app_start_timeout_sec: 300
{% endhighlight %}

You should consider tweaking these values. For an explanation of what they mean, check out the docs <a href="https://cloud.google.com/appengine/docs/flexible/custom-runtimes/configuring-your-app-with-app-yaml#readiness_checks">here.</a>

### Unit Tests
Nothing is complete without adding unit tests. To do this, we'll add 2 unit tests, one that tests if the API returns 200 OK on a successful connection to the database, and a test for checking if there's no connection to the database (and if the 503 is indeed being returned). Simulating the broken database postgresql connection in Django was a little tricky, since I couldn't find documentation online, and using tools like `destroy_test_db` freaks out the tests as Django thinks something has gone wrong. I was stuck for quite a while on this when my mentor suggested this great idea of passing a database connection` object to the middleware, so it can use that instead of using the default `connection` object. Since we now control what connection the middleware uses, we can pass a <a href="https://docs.python.org/3/library/unittest.mock.html">mock database object</a> to it (and break it using a ``side_effect`). Using mocks revealed a host of new Google search results, compared to what I was searching (and struggling with) before.

Add the following code to your `tests.py`:

{% highlight python %}
  class HealthCheckMiddlewareTestCase(TestCase):
      readiness_url = 'https://your-domain.com/readiness_check/'

      def test_readiness_okay(self):
          request = RequestFactory().get(self.readiness_url)
          health_check = HealthCheckMiddleware(None)
          response = health_check(request)
          self.assertEqual(response.status_code, 200)

      def test_readiness_failure(self):
          with patch.object(psycopg2, 'connect') as connect_method:
              connect_method.cursor.side_effect = Exception(
                  'Random Database Connection Error')

              request = RequestFactory().get(self.readiness_url)
              health_check = HealthCheckMiddleware(None)
              response = health_check(request, connect_method)
              self.assertEqual(response.status_code, 503)
{% endhighlight %}

And that's it! You can see if it worked fine by running `python manage.py test tests.HealthCheckMiddlewareTestCase`. You can now be rest assured that App Engine will only route traffic to your instance only when it can successfully connect to your database!
