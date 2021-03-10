"use strict";
document.addEventListener("DOMContentLoaded", start);

const features = {
  carpet: false,
};
let elementToPaint;

async function start() {
  let response = await fetch("couch-01.svg");
  let mySVGData = await response.text();
  document.querySelector("#couch_svg").innerHTML = mySVGData;
  addListenersToElements();
  hideFeatures();
}

function addListenersToElements() {
  document.querySelectorAll(".g_to_style").forEach((element) => {
    element.addEventListener("click", clickOnSvg);
  });
  document.querySelectorAll(".color_btn").forEach((btn) => {
    btn.addEventListener("click", clickOnColorBTN);
  });
  document
    .querySelector("input[type='color']")
    .addEventListener("input", clickColorInput);
  document
    .querySelectorAll(".option")
    .forEach((option) => option.addEventListener("click", toggleOption));
}

function hideFeatures() {
  let carpet = document.querySelector("#couch_svg svg #carpet");
  carpet.classList.add("hide");
}

function clickOnSvg() {
  elementToPaint = this;
  document.querySelectorAll(".g_to_style").forEach((element) => {
    element.style.stroke = "";
  });
  elementToPaint.style.stroke = "#C2DEFC";
  elementToPaint.style.strokeWidth = "40";
}

function clickOnColorBTN() {
  if (elementToPaint !== undefined) {
    elementToPaint.style.fill = this.getAttribute("fill");
    elementToPaint.style.stroke = "";
  }
}

function clickColorInput() {
  if (elementToPaint !== undefined) {
    elementToPaint.style.fill = this.value;
    elementToPaint.style.stroke = "";
  }
}

function toggleOption(event) {
  const target = event.currentTarget;
  const feature = target.dataset.feature;
  features[feature] = !features[feature];

  if (features[feature]) {
    target.classList.add("chosen");
    let previewPic = document.querySelector("#couch_svg #" + feature + "2");

    previewPic.classList.remove("hide");
    previewPic.classList.add("in_animation");
    setTimeout(() => {
      previewPic.classList.remove("in_animation");
    }, 5000);

    let featureElement = createFeatureElement(feature, target);
    document.querySelector("#selected ul").appendChild(featureElement);

    //animation
    //first
    const start = target.getBoundingClientRect();
    //last
    const end = featureElement.getBoundingClientRect();
    //invert
    const diffX = start.x - end.x;
    const diffY = start.y - end.y;

    featureElement.style.transform =
      "translate(" + diffX + "px," + diffY + "px)";
    featureElement.offsetHeight;
    //play
    featureElement.style.transition = "transform 1s";
    featureElement.style.transform = "translate(0,0)";
  } else {
    // feature removed
    target.classList.add("chosen");
    let previewPic = document.querySelector("#couch_svg #" + feature);

    previewPic.classList.add("hide");

    let featureElement = document.querySelector(
      "#selected [data-feature='" + feature + "']"
    );
    console.log(featureElement);

    //animation
    //first
    const start = featureElement.getBoundingClientRect();
    //last
    const end = target.getBoundingClientRect();
    //invert
    const diffX = end.x - start.x;
    const diffY = end.y - start.y;

    featureElement.style.transform =
      "translate(" + diffX + "px," + diffY + "px)";
    featureElement.addEventListener("transitionend", () => {
      featureElement.remove();
    });
  }
}

function createFeatureElement(feature, target) {
  const li = document.createElement("li");
  li.dataset.feature = feature;

  const figure = document.createElement("figure");
  figure.innerHTML = target.innerHTML;

  li.append(figure);

  return li;
}
