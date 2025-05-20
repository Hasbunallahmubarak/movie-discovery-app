"use strict";
const sliderContainer = document.querySelector(".slide-container");
const sliders = document.querySelectorAll(".slide");
const leftBtn = document.querySelector(".left-btn");
const rightBtn = document.querySelector(".right-btn");
const nav = document.querySelector("nav");

let activeSlide = 0;

// declaring functions
setBgBody();
setActiveSlide();

// set body background
function setBgBody() {
	sliderContainer.style.backgroundImage = sliders[activeSlide].style.backgroundImage;
}

// active slide function
function setActiveSlide() {
	sliders.forEach((slide) => slide.classList.remove("active"));
	sliders[activeSlide].classList.add("active");
}

//watch arrow left and right keys to triger appropriate slider function
document.addEventListener("keydown", function(e) {
	if (e.key === 'ArrowRight') {
		rightFunc()
	}
	if (e.key === 'ArrowLeft') {
		leftFunc()
	}
})


//click events on right button
rightBtn.addEventListener("click", rightFunc);

function rightFunc() {
	nextSlide();
	setBgBody();
	setActiveSlide();
}

//click events on left button
leftBtn.addEventListener("click", leftFunc);

function leftFunc() {
	activeSlide--;
	if (activeSlide < 0) { activeSlide = sliders.length -1}
	setBgBody();
	setActiveSlide();
}

//next slide function 
function nextSlide() {
	prevSlide();
}

//previous slide function 
function prevSlide() {
	activeSlide++;
	if (activeSlide > sliders.length -1) { activeSlide = 0} 
}

//sticky nav
window.addEventListener("scroll", () => {
	let html = document.documentElement;
	let body = document.body;
	if(html.scrollTop > nav.scrollHeight || body.scrollTop > nav.scrollHeight){
		nav.classList.add("stick");
	} else {
		nav.classList.remove("stick");
	}
});

//side-nav
const sideNav = document.getElementById("side-nav");
const menuBar = document.getElementById("mobile");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("close");

menuBar.addEventListener("click", () => {
	sideNav.style.right = "0px";
	overlay.style.display = "block";
});

closeBtn.addEventListener("click", closeSideNav);
overlay.addEventListener("click",  closeSideNav);
function closeSideNav() {
	sideNav.style.right = "-300px";
	overlay.style.display = "none";
}