---
layout: post
title:  "Hello World"
---
### Jekyll
After much, much deliberation and thinking I've decided to go with <a href="https://jekyllrb.com/">Jekyll</a> to host this blog. My initial idea was to write my own Blog app using either Django or Ruby on Rails and host it on Google App Engine with Cloud SQL for the database. But if you really think about it, that's a lot of work. None of it is particularly difficult, but the amount of time, energy and resources put into doing a thing so simple as to create a Blog on your website is just not worth it, in my opinion.

True, it would have been cool to write on a Blog app that was created by me. Think of the customization I could do, it would give me insane control over everything. But the very idea of doing all this just wasn't exciting to me. Would I learn something new? Yes, I guess. The nitty gritties of creating s3 or Cloud Storage buckets for handling statics or maybe the small details of using Django Google OAuth, etc. I guess. But would that really be worth it? It's not like I'm a beginner programmer who has vast amounts to learn from creating a CRUD application! Plus I kinda sorta do these things at work already.

Using Jekyll got me to write the first post, with auto generated SEO and Ruby like {{ includes}} tags and all. What more could I want? A comment section maybe? I guess I could maybe use Disqus or something along those lines.


### a3y3.dev
The <code>.dev</code> domain should probably tell you that the blog will focus mostly on software development related posts. It's uncountable how many times a privately hosted blog has helped me solve a challenge, and apart from giving back to the developer community it also helps me keep track of and better understand how I solved my own challenges.

As for what a3y3 is, well...you don't really want to know (but if you really do, feel free to send me an email!)

Also, to end this post - this is how code blocks look like. Pretty happy with the result!
{% highlight python %}
  class Solution:
      def climbStairs(self, n: int) -> int:
          return self.num_ways(n)

      def num_ways(self, n: int) -> int:
          if n < 1:
              return 0
          if n == 1:
              return 1
          if n == 2:
              return 2
          cache = [0] * (n + 1)
          cache[1] = 1
          cache[2] = 2
          for i in range (3, n + 1):
              cache[i] = cache[i - 1] + cache[i - 2]

          return cache[n]
{% endhighlight %}
