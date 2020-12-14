---
title: I Switched from Dashlane to Bitwarden and Why You Should, Too
layout: posts
summary: Dashlane has a lot of problems, some of them critical, that no one seems to talk about in any reviews for some reason. I finally left Dashlane and switched to Bitwarden, which feels much more dependable.
description: Dashlane has a lot of problems, some of them critical, that no one seems to talk about in any reviews for some reason. I finally left Dashlane and switched to Bitwarden, which feels much more dependable.
comments: true
---
It's 2020. If you aren't using a password manager yet, [drop everything you're doing and switch to one](https://security.stackexchange.com/a/45067/211865){:target="_blank"}.

Using password managers is a _very_ good idea. Up until last year, I was using Chrome's password manager, and it worked well, for the most part. However, I wanted something more dedicated, since I had started to see obvious issues with it (no concept of "master" password, no special characters in password generators, no cross platform support, etc.). I searched around for password managers, and most reviews recommended options like Dashlane, 1password, Lastpass, etc. Figuring that there wouldn't be much difference between these options, I decided to give Dashlane a try. After all, everyone did say "you can't go wrong with any of these". Boy, was I wrong.

The more I used Dashlane, the more puzzled I became at some of the design decisions the company chose to make. I ran into some bugs that are not only deal breakers, but are outright security issues. Since I had paid for a year of Dashlane's premium subscription, I decided to give it a chance anyway. After having none of those issues go away after 11 months, I decided to just give up and switch to Bitwarden yesterday. In a couple of hours, all my issues magically went away. Here are my gripes with Dashlane:

### Dashlane's Autofill feature
One of the things that annoyed me the most with Dashlane was the "auto login" feature. If you're on a website's login page and Dashlane has only one login for that, it'll simply fill the credentials in, and then **_click the submit buttom for you_**. The first time it happened to me I was so confused I had no idea what happened. This is just straight up no-no in my books. Software should never do things for you unless you specifically configure it to do that. It should merely suggest and serve helpful suggestions, never do actions on your behalf. Not only that, but:

- You can't click the "Remember me" checkbox or interact with the page in any way.
- Some sites have a login page on their home screen, and this feature just makes you jump directly without even asking if you _want_ to log in in the first place.
- There's no global switch to turn off this feature. You literally have to open each password item in the Dashlane app and turn it off. Needless to say, for hundreds of passwords, this feasible at all.

### Broken Popups
Dashlane's password fill in popup would just randomly not appear sometimes, both in the extension, and on my Android device, requiring me to open the app and manually copy the password from there. Besides being annoying, this is a very serious security concern, since the only time the password fill in pop up should not appear [is when you're on a phishing site](https://security.stackexchange.com/a/45067/211865){:target="_blank"}. 

I even got phished because of this once. Someone messaged me an invite to their Steam account, but the URL was staemcommunity.us (Notice the 'a' and 'e' flipped. Also, Steam doesn't have a .us domain, but it looked official enough for me in that moment). The page was a 1:1 replica of the steam page, and Dashlane refused to show the password popup. Rolling my eyes, I opened the dashlane app, copied my username and password and even submitted the form. Thankfully, the minute I submitted it I realized something was wrong (the page told me that my username/password combo was incorrect, which it couldn't possibly be), and I figured out I was phished, and changed my credentials quickly. This would have never happened had Dashlane's popup been more reliable for me.

### No Desktop App support for Linux
I solely use [Pop!OS](https://pop.system76.com/){:target="_blank"} for everything, including gaming. Imagine my disppointment when I found that Dashlane's desktop app only supports Windows and Mac. Without the app, you can't use Dashlane's VPN (why would you pay for premium then?). You also can't use features like password export.

To shift to Bitwarden, I literally had to download Windows 10, create a virtual machine, install the app, then use the export feature. _Why doesn't the web app have such a basic utility feature?_

### No ability to lock extension on sleep
Whenever I lock/put my device to sleep, I want to extension to lock itself too, otherwise there really isn't any point to having a master password. Dashlane has no such feature. Anyone who can someone get in my machine also suddenly has access to all my passwords. Bitwarden, a free service, has that feature.


### Broken Password Export
Thankfully, Dashlane offers to export all your stored information in a JSON so you can shift to some other (read: better) password manager. However, after migrating to Bitwarden, I noticed that it wasn't working well with subdomains. My first instinct was to blame Bitwarden, but upon inspecting the JSON export of my information, I found out that Dashlane had grouped together passwords for all subdomains into the domain. For example, the passwords for `abc.example.com` and `pqr.example.com` were stored in the JSON as 2 different passwords for `example.com`. Morever, none of my "Secure Notes" had made it in the export. I'm going to have to manually spend some time to clean up this mess.

### Conclusion
Just use Bitwarden. It's free, and the premium plan is 1/5th the price of Dashlane, and it is much more usable and has more features than Dashlane.