---
layout: post
title:  "Thrash Tuning"
categories: good-practices
---
A term coined by my mentor, thrash tuning is desperately trying out different things until a problem goes away, without giving the problem itself a lot of thought. When you thrash tune, you have no real indication that what you are going to try will even fix the problem. A good example is a slow HTTP request - your first instinct might be to throw a cache in front of the database, but it's possible that the reason you had slowness wasn't because of a slow DB access, it was because of a CPU intensive query. I Googled this term and it didn't show up anywhere, so kudos to him for coming up with it! As a software engineer, when there's an issue, it's very easy to get frustrated and annoyed at bugs - you just want to get rid of them asap. But if you think about it, there are a lot of obvious reasons why thrash tuning is bad. 

A problem in your application usually indicates a flaw in your logic/understanding of your application. It's understandable to get annoyed when things don't go the way you thought they would, but bugs present an opportunity to get better at what you do. When you thrash tune, it's easy to lose this opportunity and focus only on the part where you try to fix the issue fast rather than spend time coming up with good solutions. And don't get me wrong - of course, in most cases, doing that does indeed fix the problem very quickly. But that's like applying duct tape to the holes in a sinking ship. A lot of such duct tapes and suddenly a year later you find out that only a major rewrite of large components in your application can fix the issue.

I find that a good way to know if you are thrash tuning is to ask yourself: "Is there any evidence of a corelation with my proposed fix and the issue I'm trying to solve? If not, if I do end up trying my fix, is there any way to get a testable outcome?". If the answers to both these questions are no, you probably want to pause for a bit and think some more. 

I read something on Quora a long time that has stuck with me since then:
    <img class="img-div-fit" src="/assets/images/bad-programmer-signs.png">
Thrash Tuning would similiar to point #2 - trying out random stuff and being ok with the first solution that works. That said, of course, you can't spend days coming up with the best solution for every little problem. That, however, is what makes a good software engineer: knowing what problem is important enough to not give in to the temptation of thrash tuning!