---
layout: post
title:  "Save time by deploying your microservices to GCP in parallel"
categories: cloud
tags: featured
---
### tl;dr
You can define the code for deploying each microservice inside an Azure Pipelines <a target="_blank" href="https://docs.microsoft.com/en-us/azure/devops/pipelines/process/phases?view=azure-devops&tabs=yaml">job.</a> Since jobs automatically run in parallel, these microservices will be deployed at once rather than sequentially, greatly reducing your time to deploy.

If you're familiar with Azure Pipelines syntax, you can also <a href="#template-parallel-deploys">skip to the chunk of this article</a> (using loops to generate jobs to deploy in parallel).


### Who this article is for
You might find this article relevant if:
<ul>
    <li>You have a microservice based architecture.</li>
    <li>You use Google App Engine to host them.</li>
    <li>
        You already use or are okay with learning how to use <a target="_blank" href="https://docs.microsoft.com/en-us/azure/devops/pipelines/?view=azure-devops">Azure Pipelines</a> to deploy them.
    </li>
</ul>


### Deploying to GCloud
#### Getting Started
Make sure you have an account on Azure Devops (I'm going to call that ADO from now) that allows you to create pipelines. Go ahead and set up a basic YAML pipeline with a blank file and a trigger of your choice:
{% highlight yaml %}
# azure-pipelines.yaml
trigger:
  master
{% endhighlight %}
This pipeline will trigger when the `master` branch is updated. This is just an example, your triggers could (and should) differ, that's not really important.

#### Add your first Stage
Stages in ADO aren't strictly necessary to be specified, but it's a good idea to do that since you might want to later create a <code>Test</code> stage that the <code>Deploy</code> stage depends on. In the stage, add conditional jobs that call a template (which we will create in the next step). The conditions define when those jobs are actually created in the final YAML that ADO generates for you. For example:
{% highlight yaml %}
# azure-pipelines.yaml
trigger:
  master
stages:
  - stage: 'Deploy'
    pool:
      vmImage: 'ubuntu-latest'
    jobs:
      - $\{\{ if eq(variables['Build.SourceBranch'], 'refs/heads/dev') }}:
        - template: deploy/template.yml
          parameters:
            environment: 'dev'
      - $\{\{ if eq(variables['Build.SourceBranch'], 'refs/heads/staging') }}:
        - template: deploy/template.yml
          parameters:
            environment: 'staging'
      - $\{\{ if startsWith(variables['Build.SourceBranch'], 'refs/tags/release/') }}:
        - template: deploy/template.yml
          parameters:
            environment: 'production'
{% endhighlight %}

#### Create the deploy template
In the yaml above, the dynamically created jobs call a template with the <code>environment</code> parameter. The template will use that parameter to determine where to deploy the microservices to.

This is also where we bring in the parallel deploys. Note that each Job is run in parallel by ADO, so all we have to do is define a job for each microservice. 

Let's say the general way to deploy a microservice is like:
{% highlight bash %}
# insert bash scripts here to handle pre deploy and create/edit/prepare your app.yaml
gcloud app deploy
{% endhighlight %}

Then, all we need to do is:
<ol>
    <li>
    Figure out how to run gcloud.
    </li>
    <li>
    Figure out permissions for gcloud.
    </li>
</ol>

For 1, run the commands:
{% highlight bash %}
curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-295.0.0-linux-x86_64.tar.gz &&
tar zxf google-cloud-sdk-295.0.0-linux-x86_64.tar.gz google-cloud-sdk &&
./google-cloud-sdk/install.sh --quiet
{% endhighlight %}

For 2 we need to create a service account. Create a new service account on Gcloud with App Engine Admin permisisons and upload the secret key to ADO's <code>Library</code>. You can then use a <code>DownloadSecureFile</code> task to download that onto your ADO VM (the one that's running this deploy) and run:
{% highlight bash %}
gcloud auth activate-service-account --key-file=$(serviceAccountKey.secureFilePath)
{% endhighlight %}

to activate the service account.

Your template will look like:
{% highlight yaml %}
# deploy/template.yaml
parameters:
- name: environment
  type: string

jobs:
  - job: 'deploy'
    steps:
      - script 1
      - script 2
      - script 3
      - gcloud app deploy --project my-project-${{parameters.environment}}
{% endhighlight %}

<h4 id="template-parallel-deploys">Modify template to allow parallel deploys</h4>
A very powerful but rather undocumented of Azure Pipelines is loops. Using these loops, we can reuse our existing job for multiple micoservices. And since jobs run in parallel, all these microservices will deploy at the same time, saving loads of time!</p>
With loops, our pipeline now looks something like:
{% highlight yaml %}
# deploy/template.yaml
parameters:
- name: environment
  type: string
- name: microservices
  type: object
  default:
    - microservice1
    - microservice2
    - microservice3 

jobs:
  - $\{\{ each microservice in parameters.microservices }}:
    - job: 'deploy'
      steps:
        - script 1
        - script 2
        - script 3
        - gcloud app deploy --project my-project-${{parameters.environment}}
{% endhighlight %}

<b>Tip</b>: Make sure you are VERY careful with your indentation when you use either conditionals or loops. YAML doesn't generally hold too much importance to indentation, but loops and conditionals don't have an <code>endif</code> or an <code>endfor</code>, and ADO will use indentation to recognize when you want to end your loop.

When this pipeline is triggered, this is what you will see in the UI:
<img class="img-div-fit" src="/assets/images/parallel-microservices-deploy.png">

And that's it! Regardless of how many microservices you add, the deploy will still take around 10 minutes (in reality though, I'm sure there's some sort of limit beyond which either ADO or GCP can't handle parallel deploys, but I've tried with as many as 12 and neither cloud service even faltered)

Please note that the above is a highly oversimplified version of what your actual deploy YAML will look like. Let me know if you have any specific questions below, and I'd love to answer them :)