# CouponStack

Deployed to Scroll at 0x64280006026cFBf45d2A594594c87717f64dFe7E

Get visibility and start marketing by providing coupons based on users on-chain activity. 

The idea is that any company wanting to get visibility can roll out offers or coupons through targeted marketing using our application. If we send coupons randomly, the customer retention of that company will be very low. That's where our app comes in and helps the company target the exact customers who will use their app and services and help in better and efficient customer aquisition.

In our app, we have a company login where they can list their coupons and roll them out to the users. These users will be obtained through the AirStacks API, which takes into consideration multiple parameters like lens and farcaster social media data, XMTP account details, all the tokens owned by the users (like ERC20, ERC721, ERC1155,poap etc.), their count, and value. Using these metrics, we have generated our own custom algorithm to fetch appropriate users. Companies can give custom inputs or can select from already existing user categories to fetch targeted users.

So, the company can list coupons and submit them to our app, after which they can mint the required number of coupons based on the number of eligible users obtained through AirStacks. Then, they can randomly distribute all the coupons to the users. Now, the users can claim the coupons, and all the redeemable coupons will be visible on the user's dashboard. They can then select the appropriate coupons and use them wherever required.

We are using AirStacks API to get the on-chain activity of any blockchain address. 
We have deployed our smart contract on Scroll Network. 
We have used Tableland to store user data. 
We have used Notifi, which is built on XMTP, to send email notifications to the users.

Youtube Video Link: https://www.youtube.com/watch?v=VtkdmZkSVg0

