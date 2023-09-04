class Streamer {
  constructor(name, streamTitle, streamCategory, div) {
    this.name = name;
    this.streamTitle = streamTitle;
    this.streamCategory = streamCategory;
    this.div = div;
  }
}

const streamers = (function () {
  const all = [];
  const donathoners = [];
  const sleepers = [];
  const getDonothoners = function () {
    all.forEach((streamer) => {
      if (
        streamer.streamTitle.includes("donathon") ||
        streamer.streamTitle.includes("donaton") ||
        streamer.streamTitle.includes("donothon") ||
        streamer.streamTitle.includes("donoton") ||
        streamer.streamTitle.includes("دونوتون") ||
        streamer.streamTitle.includes("دوناتون")
      ) {
        if (!donathoners.includes(streamer)) {
          donathoners.push(streamer);
          if (streamer.streamCategory === "i'm only sleeping")
            sleepers.push(streamer);
        }
      }
    });
    return donathoners;
  };
  return {
    all,
    getDonothoners,
    sleepers,
  };
})();

const domHelper = (function () {
  const create = function (streamerCount, donathoerCount, sleeperCount) {
    const container = document.createElement("div");
    const h1 = document.createElement("h1");
    h1.classList.add("text-2xl");
    h1.classList.add("text-grey-900");

    h1.textContent = `از ${streamerCount} استریمر در حال پخش، ${donathoerCount} استریمر دوناتون دارن که ${sleeperCount} تاشون خوابن!`;
    if (sleeperCount == 1) {
      h1.textContent = `از ${streamerCount} استریمر در حال پخش، ${donathoerCount} استریمر دوناتون دارن که ${sleeperCount} کی‌شون خوابیده!`;
    } else if (sleeperCount == 0) {
      h1.textContent = `از ${streamerCount} استریمر در حال پخش، ${donathoerCount} استریمر دوناتون دارن و کسی خواب نیست!`;
    }
    container.appendChild(h1);
    return container;
  };
  return { create };
})();

function categorize() {
  const divs = document.querySelectorAll("a.paxit-card");
  const array = Array.from(divs);
  const header = document.querySelector("header");

  array.forEach((item) => {
    let name =
      item.children[1].children[1].children[0].textContent.toLowerCase();
    let title =
      item.children[1].children[1].children[1].textContent.toLowerCase();
    let category =
      item.children[1].children[1].children[2].textContent.toLowerCase();

    let streamer = new Streamer(name, title, category, item);

    if (!streamers.all.some((item) => item.name == streamer.name))
      streamers.all.push(streamer);
  });

  const donathoners = streamers.getDonothoners();
  const sleepers = streamers.sleepers;

  const output = domHelper.create(
    streamers.all.length,
    donathoners.length,
    sleepers.length
  );

  output.classList.add("container");
  output.classList.add("mx-auto");
  output.classList.add("px-4");

  output.style.padding = "2em 1em";

  const btn = document.createElement("button");
  btn.textContent = "مخفی کردن دوناتون‌ها";

  const list =
    "rounded-3xl text-white bg-primary-500 hocus:bg-primary-600 hocus:shadow-sm press:bg-primary-700 press:shadow-inner inline-block enabled:cursor-pointer select-none relative hocus:outline-none fill-current transition-colors whitespace-nowrap h-8 text-sm px-4 flex flex-row items-center justify-center gap-3";

  const classArray = list.split(" ");

  classArray.forEach((classItem) => {
    if (classItem != "" && classItem != " ") {
      btn.classList.add(classItem);
    }
  });

  output.classList.add("donothoners");

  btn.addEventListener("click", () => {
    donathoners.forEach((streamer) => {
      streamer.div.classList.remove("!transition-colors");
      streamer.div.style.transition = "opacity 1s";
      streamer.div.classList.toggle("dono-hidden");

      if (streamer.div.classList.contains("dono-hidden")) {
        btn.textContent = "نمایش دوناتون‌ها";
      } else {
        btn.textContent = "مخفی کردن دوناتون‌ها";
      }
    });
  });
  output.appendChild(btn);

  let old = document.querySelector(".donothoners");
  if (old !== null) {
    header.replaceChild(output, old);
  } else {
    header.appendChild(output);
  }

  return streamers;
}

let f = setInterval(function () {
  let x = categorize();
  if (x.all.length !== 0) {
    x = categorize();
    clearInterval(f);
    // console.log(x.all);
    return "success";
  }
}, 1000);
