// @ts-check
const { test, expect,request } = require('@playwright/test');

test(" Simple Tool API - Get All Tools", async () => {
  const apiContext = await request.newContext();
 
  const response = await apiContext.get("https://simple-tool-rental-api.glitch.me/tools");
  // Store JSON response in a variable
  const responseData = await response.json();
  console.log(responseData);
 
  // Assertions
 
  expect(response.status()).toBe(200);
  for (let i = 0; i < responseData.length; i++) {
    expect(typeof responseData[i].inStock).toBe("boolean");
    expect(responseData[i]).toHaveProperty("name");
    expect(responseData[i]).toHaveProperty("id");
    expect(typeof responseData[i].category).toBe("string");
  }
 
});