# Lab 9: Testing (lsantill)

I was in charge of creating the graph and the news feed, and used APIs for both.
Given that it is front end and API usage, I will document my testing here.

## News Feed
I tested this by fetching news for different companies, making sure that each
article presented has the company name in the headline. I also made sure that
the dates are in chronological order, and only the required amount of articles
are presented on the page. I also made sure that the news that is from the
current day have the time displayed, while news that is from a different day
have the day of the article displayed. New news is fetched every 10 seconds,
using the google news api.

## Price Graph
