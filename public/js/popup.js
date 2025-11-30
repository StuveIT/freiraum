const popup_overlay = document.getElementById("popup-overlay");
const popup = document.getElementById("popup");

export const popup_show = (html, e) => {
  popup.innerHTML = html;
  popup_overlay.style.visibility = 'visible';
};

export const popup_hide = () => {
  popup.innerHTML = "";
  popup_overlay.style.visibility = 'hidden';
}

document.addEventListener('click', (e) => {
  popup_hide()
});
