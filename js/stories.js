// "use strict";

// // This is the global list of the stories, an instance of StoryList
// let storyList;

// /** Get and show stories when the site first loads. */

// async function getAndShowStoriesOnStart() {
//   storyList = await StoryList.getStories();
//   $storiesLoadingMsg.remove();

//   putStoriesOnPage();
// }

// /**
//  * A render method to render HTML for an individual Story instance
//  * - story: an instance of Story
//  *
//  * Returns the markup for the story.
//  */

// function generateStoryMarkup(story) {
//   const hostName = story.getHostName();
//   const favoriteClass = story.isFavorite ? "fas" : "far"; // Use Font Awesome classes or any other icon library

//   return $(`
//     <li id="${story.storyId}">
//       <a href="${story.url}" target="_blank" class="story-link">
//         ${story.title}
//       </a>
//       <small class="story-hostname">(${hostName})</small>
//       <small class="story-author">by ${story.author}</small>
//       <small class="story-user">posted by ${story.username}</small>
//       <i class="${favoriteClass} fa-star favorite-btn"></i> <!-- Favorite/unfavorite button -->
//     </li>
//   `);
// }

// $allStoriesList.on("click", ".favorite-btn", async function (evt) {
//   const $target = $(evt.target).closest("li");
//   const storyId = $target.attr("id");

//   if (currentUser.isFavorite(storyId)) {
//     // Remove from favorites
//     await currentUser.removeFavoriteStory(storyId);
//     $target.find(".favorite-btn").toggleClass("fas far"); // Toggle the favorite icon
//   } else {
//     // Add to favorites
//     await currentUser.addFavoriteStory(storyId);
//     $target.find(".favorite-btn").toggleClass("fas far"); // Toggle the favorite icon
//   }
// });

// /** Gets list of stories from the server, generates their HTML, and puts them on the page. */

// function putStoriesOnPage() {
//   console.debug("putStoriesOnPage");

//   $allStoriesList.empty();

//   // loop through all of our stories and generate HTML for them
//   for (let story of storyList.stories) {
//     const $story = generateStoryMarkup(story);
//     $allStoriesList.append($story);
//   }

//   $allStoriesList.show();
// }

// /** Submit story form */

// async function submitStoryForm(evt) {
//   evt.preventDefault();

//   const title = $("#title").val();
//   const author = $("#author").val();
//   const url = $("#url").val();

//   const newStory = await storyList.addStory(currentUser, { title, author, url });

//   // Add the new story to the page
//   const $newStory = generateStoryMarkup(newStory);
// $allStoriesList.prepend($newStory);
// $newStory.show();
// $storyForm.hide();
// }
// $("#add-story-form").on("submit", submitStoryForm);

















"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;
let isLoggedIn = false; // Set the initial login status
let token; // Define the token variable

/** Get and show stories when the site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  const hostName = story.getHostName();
  const favoriteClass = story.isFavorite ? "fas" : "far"; // Use Font Awesome classes or any other icon library

  const $story = $(`
    <li id="${story.storyId}">
      <a href="${story.url}" target="_blank" class="story-link">
        ${story.title}
      </a>
      <small class="story-hostname">(${hostName})</small>
      <small class="story-author">by ${story.author}</small>
      <small class="story-user">posted by ${story.username}</small>
      <i class="${favoriteClass} fa-star favorite-btn"></i> <!-- Favorite/unfavorite button -->
    </li>
  `);

  // Add the delete button only for the logged-in user
  if (currentUser && currentUser.username === story.username) {
    const $deleteButton = $(`
      <button class="delete-btn" data-story-id="${story.storyId}">
        Delete
      </button>
    `);
    $story.append($deleteButton);
  }

  return $story;
}

function handleDeleteStory(storyId, token) {
  const url = `https://hack-or-snooze-v3.herokuapp.com/stories/${storyId}`;

  // Set the request headers
  const headers = {
    Authorization: `Bearer ${token}`
  };

  axios
    .delete(url, { headers: headers })
    .then(response => {
      // Handle success response
      console.log(response.data.message);
      // Refresh or update the UI as needed
    })
    .catch(error => {
      // Handle error response
      console.error(error);
      // Handle specific error scenarios as needed
    });
}

$allStoriesList.on("click", ".favorite-btn", async function (evt) {
  const $target = $(evt.target).closest("li");
  const storyId = $target.attr("id");

  if (currentUser.isFavorite(storyId)) {
    // Remove from favorites
    await currentUser.removeFavoriteStory(storyId);
    $target.find(".favorite-btn").toggleClass("fas far"); // Toggle the favorite icon
  } else {
    // Add to favorites
    await currentUser.addFavoriteStory(storyId);
    $target.find(".favorite-btn").toggleClass("fas far"); // Toggle the favorite icon
  }
});

$allStoriesList.on("click", ".delete-btn", function (evt) {
  const $target = $(evt.target).closest("li");
  const storyId = $target.attr("id");

  handleDeleteStory(storyId, token);
});

/** Gets list of stories from the server, generates their HTML, and puts them on the page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);

    // Create a delete button for each story
    const $deleteButton = $(`
      <button class="delete-btn" data-story-id="${story.storyId}">
        Delete
      </button>
    `);

    // Append the delete button to the story markup
    $story.append($deleteButton);

    // Append the story to the stories list
    $allStoriesList.append($story);
  }

  // Attach event handler for delete buttons
  $allStoriesList.on("click", ".delete-btn", function (evt) {

    handleDeleteStory($(evt.target).data("story-id"), token);
  });

  $allStoriesList.show();
}

/** Submit story form */

async function submitStoryForm(evt) {
  evt.preventDefault();

  const title = $("#title").val();
  const author = $("#author").val();
  const url = $("#url").val();

  const newStory = await storyList.addStory(currentUser, { title, author, url });

  // Add the new story to the page
  const $newStory = generateStoryMarkup(newStory);
  $allStoriesList.prepend($newStory);
  $newStory.show();
  $storyForm.hide();
}

$("#add-story-form").on("submit", submitStoryForm);
$allStoriesList.on("click", ".delete-btn", async function (evt) {
  const $target = $(evt.target);
  const storyId = $target.attr("data-story-id");

  // Call the API or perform the necessary logic to delete the story

  // Optionally, remove the story from the DOM
  $target.closest("li").remove();
});