import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chartContainer = document.querySelector("#chart-container");

let loadInterval;

function loader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    element.textContent += ">";
    if (element.textContent === ">>>>") {
      element.textContent = "";
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

function generateUniqueId() {
  const timeStamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timeStamp}-${hexadecimalString}`;
}

// function generateUniqueId() {
//   const timestamp = new Date().getTime();
//   const randomNumber = Math.random();
//   const hexString = randomNumber.toString(16).substring(2, 8);
//   return `id-${timestamp}-${hexString}`;
// }

function chartStripe(isAi, value, uniqueId) {
  return `
    <div class="wrapper ${isAi && "ai"}" >
      <div class="chat">
        <div class="profile">
          <img
          src="${isAi ? bot : user}"
          alt="${isAi ? bot : user}"
          />
        </div>
          <div class="message" id="${uniqueId}">${value}</div>
      </div>
    </div>
    `;
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  // Generate unique IDs for the user and bot message elements
  const userUniqueId = generateUniqueId();
  const botUniqueId = generateUniqueId();

  // User's chartstripe
  chartContainer.innerHTML += chartStripe(
    false,
    data.get("prompt"),
    userUniqueId
  );

  form.reset();

  // Bot's chartstripe
  chartContainer.innerHTML += chartStripe(true, " ", botUniqueId);

  chartContainer.scrollTop = chartContainer.scrollHeight;

  // Get the message div elements using their unique IDs
  const userMessageDiv = document.getElementById(userUniqueId);
  const botMessageDiv = document.getElementById(botUniqueId);

  // Start loader for the bot message
  loader(botMessageDiv);

  //fetch data from the server -> bot's response
  const response = await fetch("https://jai.onrender.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: data.get("prompt"),
    }),
  });

  clearInterval(loadInterval);
  botMessageDiv.innerHTML = "";

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();

    typeText(botMessageDiv, parsedData);
  } else {
    const err = await response.text();

    botMessageDiv.innerHTML = "Something went wrong";

    alert(err);
  }
};
//
//
//
//
//
//
//
//
//
// const handleSubmit = async (e) => {
//   e.preventDefault();

//   const data = new FormData(form);

//   // Generate unique IDs for the user and bot message elements
//   const userUniqueId = generateUniqueId();
//   const botUniqueId = generateUniqueId();

//   // User's chartstripe
//   chartContainer.innerHTML += chartStripe(
//     false,
//     data.get("prompt"),
//     userUniqueId
//   );

//   form.reset();

//   // Bot's chartstripe
//   chartContainer.innerHTML += chartStripe(true, " ", botUniqueId);

//   chartContainer.scrollTop = chartContainer.scrollHeight;

//   // Get the message div elements using their unique IDs
//   const userMessageDiv = document.getElementById(userUniqueId);
//   const botMessageDiv = document.getElementById(botUniqueId);

//   // Start loader for the bot message
//   loader(botMessageDiv);

//   try {
//     //fetch data from the server -> bot's response
//     const response = await fetch("http://localhost:5000", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         prompt: data.get("prompt"),
//       }),
//     });

//     clearInterval(loadInterval);
//     botMessageDiv.innerHTML = "";

//     if (response.ok) {
//       const data = await response.json();
//       const parsedData = data.bot.trim();

//       typeText(botMessageDiv, parsedData);
//     } else {
//       botMessageDiv.innerHTML = "Something went wrong";
//       const err = await response.text();
//       alert(err);
//     }
//   } catch (error) {
//     botMessageDiv.innerHTML = "Something went wrong";
//     console.error(error);
//     console.error(error.message);
//     alert("Error: " + error.message);
//   }
// };

form.addEventListener("submit", handleSubmit);
form.addEventListener("enter", handleSubmit);
form.addEventListener("keyUp", (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    // code to execute when enter is pressed
    handleSubmit(event);
  }
});
