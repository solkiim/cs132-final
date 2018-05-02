# Lab 9: Testing (chk2)

My portion of the testing lab consisted of testing HTML/CSS/Link validation through w3c because my role on the team was as the designer. I was not able to perform usability testing because we have not hosted the website at this point of our project so I went ahead and asked questions about our final high-fidelity mockup.

# HTML/CSS Test
All testing was done through the W3C HTML and CSS Validation Service.

## account.html

Line 50 and 68: there are duplicate IDs in this HTML file. The first occurrence of id="username" occurred on line 50 then line 68. Sol (who was in charge of accounts) changed the second id to id="username-field".

## 404.html

No errors or warnings to show.

## index.html

Lines 64, and 171: an < img > element must have an "alt" attribute. Fixed the issue by giving each img an alt describing what the img is.

Line 198, 200, 220, 222, 243, 245: the "for" attribute of the < label > elements must refer to a non-hidden form control. The problem was because the "for" attribute must match the "id" attribute value of another form control. I had originally labeled it as a class but gave each form input and their respective label a unique id.

## signup.html

No errors or warnings to show.

## css.css

No errors or warnings to show.


# User Testing

I essentially asked questions about the visual hierarchy of information and how intuitive the dashboard was. Some of the feedback I received on the dashboard we had so far included:
 - Why there was a Trade and Trades panel
 - Seeing more of the headline/the full headline
 - How we were going to display different dates for older news / is there a way to look at archives of news?
 - There are more headlines outside of the div
 - Why there were dates mixed in with the times - which is newer or is it random?
 - Having the trades highlight in red or green like other platforms
 - Whether or not there would be more listings

 Some issues I was able to fix myself included:
 - Changed Trade to Orders
 - Set the overflow to scroll in the News panel

Overall, users commented on how simple the platform was an gave feedback on various details of the platform.
