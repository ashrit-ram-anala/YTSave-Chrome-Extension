var iconCtn = document.querySelector(".icon-ctn");
var searchInput = document.getElementById("search-input");
var rootElement = document.body;

window.addEventListener("DOMContentLoaded", async function () {
  await renderVideoBookmarkList();

  [...document.querySelectorAll(".remove-btn")].forEach(function (item) {
    item.addEventListener("click", removeVideoFromList);
  });

  searchInput.addEventListener("keyup", searchFilter);
});

chrome.storage.onChanged.addListener(async function () {
  await renderVideoBookmarkList();

  [...document.querySelectorAll(".remove-btn")].forEach(function (item) {
    item.addEventListener("click", removeVideoFromList);
  });
});

async function renderVideoBookmarkList(event, area) {
  document.querySelector("#video-list-ctn").innerHTML = "";

  let bkmarkImg = document.createElement("img");
  bkmarkImg.src = chrome.runtime.getURL("images/bookmark.svg");

  let videoArr = await chrome.storage.sync.get("videoObj");

  let ul = document.createElement("ul");
  ul.className = "video-ul";

  for (let video of videoArr.videoObj) {
    ul.innerHTML += ` 
        <li>
        <div class="card-ctn ctn" id="${video.url}">
            <div class="section-info d-row">
                <div class="img-ctn ctn">
                  <a href="${video.urlTimestamp}" target="_blank" class="cursor">
                    <img src="${video.thumbnail}" alt="video thumbnail">
                  </a>
                </div>
                <div class="info-ctn ctn d-column">
                    <a href="${video.urlTimestamp}" target="_blank" class="title-url cursor">
                        <h2 class="title"> ${video.title} </h2>
                    </a>


                       <div class="icon-details d-row">

                            <span>  Bookmark at: ${video.timeStamp}</span>
                        </div>

            <div class="section-icons d-row">
                <div class="icon-ctn ctn d-column">
                    
                    <div class="icon trashcan cursor remove-btn">
                        <img src="./images/trashcan.svg" alt="">
                    </div>
                </div>
                
            </div>
        </div>
      </li>
    `;
  }
  //document.querySelector('#video-list-ctn').innerHTML = "";
  document.querySelector("#video-list-ctn").appendChild(ul);
}

async function removeVideoFromList(item) {
  const removeUrl = item.target.closest(".card-ctn").id;
  let videoArr = (await chrome.storage.sync.get("videoObj")).videoObj;

  for (let video of videoArr) {
    if (video.url === removeUrl) {
      let index = videoArr.indexOf(video);
      if (index > -1) {
        videoArr.splice(index, 1);
      }
      await chrome.storage.sync.set({ videoObj: videoArr });
    }
  }
}

async function updatedVideoTitle(item) {
  const idString = item.target.id.toString().substring(4);
  const inputField = document.getElementById(`input-${idString}`);

  let videoObject = await chrome.storage.sync.get("videoObj");
  let videoArr = videoObject.videoObj;

  let video = videoArr.find((vid) => {
    return vid.url === idString;
  });

  video.title = inputField.value;

  await chrome.storage.sync.set({ videoObj: videoArr });
}

async function searchFilter() {
  let filter, ul, li, a, i, txtValue;

  filter = searchInput.value.toUpperCase();

  ul = document.querySelector(".video-ul");

  li = ul.querySelectorAll("li");

  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("h2")[0];

    if (!a.innerText || !a.textContent) {
      txtValue = li[i].getElementsByTagName("h2")[0];
    } else txtValue = a.textContent || a.innerText;

    if (txtValue.toUpperCase().indexOf(filter) > -1) li[i].style.display = "";
    else li[i].style.display = "none";
  }
}

///////////////////////////// UPDATES /////////////////////////////
