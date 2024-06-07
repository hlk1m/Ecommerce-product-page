"use strict";

let count = 0;
let id = 0;
let mobileImg = 1;
let selectedImg = "product-1";
let selectedOverlayImg = "product-1";

class List {
  constructor(id, productName, price, ea) {
    this.id = id;
    this.productName = productName;
    this.price = price;
    this.ea = ea;
  }
}
let dataList = [];

const body = document.getElementsByTagName("body")[0];

// cart
let num = document.querySelector(".count_num");
const cartBtn = document.querySelector(".cart_btn");
const addBtn = document.querySelector(".btns_add");
const cart = document.querySelector(".cart_list");
const plus = document.querySelector(".plus");

// main
const countMinusBtn = document.querySelector(".count_minus");
const countPlusBtn = document.querySelector(".count_plus");
const mainImg = document.querySelector(".images_main");
const thumbnails = document.querySelector(".thumbnails");

// overlay
const overlay = document.querySelector(".overlay");
const overlayCloseBtn = document.querySelector(".close_btn");
const overlayMainImg = document.querySelector(".overlay_main-img");
const overlayBtns = document.querySelector(".overlay_main");
const overlayThumbnails = document.querySelector(".overlay_thumbnails");
const overlayThumb = document.querySelectorAll(".overlay_thumbnail");

//mobile
const mobileBtns = document.querySelector(".mobile-btns");
const mobileMenu = document.querySelector(".nav_menu");

//toggle the cart visible
function onToggleCart() {
  const shoppingCart = document.querySelector(".cart-box");
  shoppingCart.classList.toggle("hidden");
  mobileBtns.classList.toggle("disable");
}

// use the buttons to in/decrease the number
function onPlus() {
  count++;
  num.innerText = count;
}

function onMinus() {
  if (count === 0) {
    return;
  }
  count--;
  num.innerText = count;
}

// add the item list to shopping cart
function makeLi(li, data) {
  return (li.innerHTML = `
  <li class="cart_item" key=${data.id} >
    <div class="item_info">
      <img
        src="images/image-product-1-thumbnail.jpg"
        alt="item_img"
        class="item_img"
      />
      <div class="item_content">
        <span class="item_product">${data.productName}</span>
        <span class="item_price">${data.price}원</span>
      </div>
    </div>
    <div class="cart_btns">
      <button class="count-btn cart_minus">
        <i class="fa-solid fa-minus" data-id=${data.id} data-type="minus"></i>
      </button>
      <span class="cart_num ea_${data.id}" >${data.ea}</span>
      <button class="count-btn cart_plus">
        <i class="fa-solid fa-plus"  data-id=${data.id} data-type="plus"></i>
      </button>
      <button class="count-btn cart_remove">
        <i class="fa-solid fa-trash-can" data-id=${data.id} data-type="remove"></i>
      </button>
    </div>
  </li>
`);
}

function onAddCart() {
  if (count === 0) {
    return alert("수량을 추가해주세요.");
  } else if (count > 0 && window.confirm("추가하시겠습니까?")) {
    let cartNum = 0;

    //copy the count
    cartNum += count;

    //hide the empty message
    const empty = document.querySelector(".cart_empty");
    empty.classList.add("hidden");

    // make the cart list and push to array
    const list = new List(id, "Fall Sneakers", "125000", cartNum);
    dataList.push(list);

    //make and append li to cart list
    makeCartList();

    cart.addEventListener("click", cartBtnsHandler);

    // 초기화, 값 출력
    count = 0;
    id++;
    num.innerText = count;

    // Add PLUS mark on shopping cart
    plus.classList.remove("hidden");
  }
}

function makeCartList() {
  const li = document.createElement("li");
  const cart = document.querySelector(".cart_list");
  if (dataList.length === 0) {
    cart.innerHTML = `
      <li class="cart_empty">
        <strong> Your cart is empty.</strong>
      </li>
    `;

    plus.classList.add("hidden");
  } else {
    dataList.forEach((item) => {
      makeLi(li, item);
      cart.appendChild(li);
    });
  }
}

function cartBtnsHandler(e) {
  const dataId = e.target.dataset.id;
  const dataType = e.target.dataset.type;
  // Edit product count
  const div = e.target.parentElement.parentElement;
  const span = div.children[1];

  if (!dataId) {
    return;
  } else if (dataType === "plus") {
    // plus button
    dataList[dataId].ea += 1;
    span.innerText = dataList[dataId].ea;
    //
  } else if (dataType === "minus") {
    // minus button
    if (dataList[dataId].ea === 1) {
      return;
    }
    dataList[dataId].ea -= 1;
    span.innerText = dataList[dataId].ea;
    //
  } else if (dataType === "remove") {
    // remove button
    let array = dataList.filter((item) => item.id !== parseInt(dataId));
    dataList = array;
    if (window.confirm("삭제하시겠습니까?")) {
      makeCartList();
    }
  }
}

//해당 radio button이 선택되었다면 메인이미지를 변경
function onChangeMainImg(e) {
  const type = e.target.dataset.type;
  const thumbnail = document.querySelectorAll(".thumbnail-img");

  thumbnail.forEach((thumb) => {
    if (thumb.id === type) {
      thumb.classList.add("selected");
    } else {
      thumb.classList.remove("selected");
    }
  });

  mainImg.style.backgroundImage = `url(images/image-${type}.jpg)`;

  // 메인이미지 정보를 저장
  selectedImg = type;
}

function onOverlayClick() {
  overlayMainImg.style.backgroundImage = `url(images/image-${selectedImg}.jpg)`;
  overlay.classList.toggle("hidden");

  const productNum = selectedImg.slice(-1);
  const selectedThumb = document.querySelector(`.overlay_${productNum}`);
  selectedThumb.classList.add("selected");
}

// Overlay - 선택된 메인 사진으로 썸네일 사진의 css를 변경
function onOverlaySelectedThumb() {
  overlayThumb.forEach((thumb) =>
    thumb.dataset.type === selectedOverlayImg
      ? thumb.classList.add("selected")
      : thumb.classList.remove("selected")
  );
}

// Overlay - 썸네일 클릭 시 메인 이미지 변경
function onOverlayThumb(e) {
  selectedOverlayImg = e.target.dataset.type || "product-1";
  overlayMainImg.style.backgroundImage = `url(images/image-${selectedOverlayImg}.jpg)`;

  onOverlaySelectedThumb();
}

function onCloseOverlay() {
  overlay.classList.toggle("hidden");

  // remove the selected css
  overlayThumb.forEach((thumb) => thumb.classList.remove("selected"));
}

// Handle the overlay slider buttons
function onOverlaySliderBtns(e) {
  let data = e.target.dataset;
  let value = parseInt(selectedOverlayImg.slice(-1));

  if (data.btn === "left") {
    // click the left button
    if (value === 1) {
      return;
    } else {
      value -= 1;
      selectedOverlayImg = `product-${value}`;
      overlayMainImg.style.backgroundImage = `url(images/image-product-${value}.jpg)`;

      onOverlaySelectedThumb();
    }
  } else if (data.btn === "right") {
    // click the right button
    if (value === 4) {
      return;
    } else {
      value += 1;
      selectedOverlayImg = `product-${value}`;
      overlayMainImg.style.backgroundImage = `url(images/image-product-${value}.jpg)`;

      onOverlaySelectedThumb();
    }
  } else {
    // click main image or empty space
    return;
  }
}

function onMobileMainImg(e) {
  const type = e.target.dataset.type || 1;
  if (!type) {
    return;
  } else if (type === "left") {
    if (mobileImg === 1) {
      return;
    } else {
      mobileImg -= 1;
      mainImg.style.backgroundImage = `url(images/image-product-${mobileImg}.jpg)`;
    }
  } else if (type === "right") {
    if (mobileImg === 4) {
      return;
    }
    mobileImg += 1;
    mainImg.style.backgroundImage = `url(images/image-product-${mobileImg}.jpg)`;
  }
}

function onMobileToggleMenu() {
  const menuBar = document.querySelector(".nav_pages");
  const closeBtn = document.querySelector(".nav_close");

  menuBar.classList.remove("disable");
  mobileBtns.classList.add("disable");

  closeBtn.addEventListener("click", () => {
    menuBar.classList.add("disable");
    mobileBtns.classList.remove("disable");
  });
}

// Event Listener
function addEvent() {
  // cart
  cartBtn.addEventListener("click", onToggleCart);

  // main
  countMinusBtn.addEventListener("click", onMinus);
  countPlusBtn.addEventListener("click", onPlus);
  addBtn.addEventListener("click", onAddCart);
  mainImg.addEventListener("click", onOverlayClick);
  thumbnails.addEventListener("click", onChangeMainImg);

  // overlay
  overlayCloseBtn.addEventListener("click", onCloseOverlay);
  overlayThumbnails.addEventListener("click", onOverlayThumb);
  overlayBtns.addEventListener("click", onOverlaySliderBtns);

  // mobile
  mobileBtns.addEventListener("click", onMobileMainImg);
  mobileMenu.addEventListener("click", onMobileToggleMenu);
}

addEvent();

//  prevent the function on mobile
window.onresize = () => {
  const innerWidth = window.innerWidth;
  innerWidth <= "410"
    ? ""
    : mainImg.removeEventListener("click", onOverlayClick);
};
