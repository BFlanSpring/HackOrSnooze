"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

// Define $navSubmit variable and assign the element
const $navSubmit = $("#nav-submit");

// Define $storyForm variable and assign the element
const $storyForm = $("#add-story-form");

/** Show main list of all stories when click site name */
function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */
function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$body.on("click", "#nav-login", navLoginClick);

/** When a user first logs in, update the navbar to reflect that. */
function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Show story submission form on click on "submit" */
function navSubmitStory(evt) {
  console.debug("navSubmitStory", evt);
  hidePageComponents();
  $storyForm.show();
}

$navSubmit.on("click", navSubmitStory);
