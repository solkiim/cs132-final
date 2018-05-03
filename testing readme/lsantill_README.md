# Lab 9 Testing



## Testing

I was in charge of creating the graph and the news feed, and used APIs for both.
Given that it is front end and API usage, I will document my testing here.

### News Feed
I tested this by fetching news for different companies, making sure that each
article presented has the company name in the headline. I also made sure that
the dates are in chronological order, and only the required amount of articles
are presented on the page. I also made sure that the news that is from the
current day have the time displayed, while news that is from a different day
have the day of the article displayed. New news is fetched every 10 seconds,
using the google news api.
While testing this I ran into an error that came from calling a function twice,
therefore news articles were being displayed repeatedly. Another error was that
the last news article was being displayed twice. I was able to fix this by
cleaning up the code and using pop and unshift for arrays instead of splice.



### Price Graph
I tested the graph by inputting data into the corresponding tables, and viewing
the graph when the page loads. Also, the title of the graph can be changed
depending on the current token that should be displayed.
I fixed an error that caused the graph to become smaller.

```
new Chart(document.getElementById("stock-graph"), {
  type: 'line',
  data: {
    labels: times,
    datasets: [{
        data : prices, //price
        backgroundColor: '#ffe4b3', //orange
        borderColor: '#ffc966',
        fill: true,
        label: token_symbol,
      }
    ],
  },
  options: {
responsive: false,
    title: {
      display: true,
      text: token_symbol,
    }
  }
});
```
