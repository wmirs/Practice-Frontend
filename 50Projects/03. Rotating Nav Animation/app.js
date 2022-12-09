const openBtn = document.querySelector("#open")
const closeBtn = document.querySelector("#close")
const containerDiv = document.querySelector(".container")

openBtn.addEventListener("click", () => {
  containerDiv.classList.add("show-nav")
})
closeBtn.addEventListener("click", () => {
  containerDiv.classList.remove("show-nav")
})