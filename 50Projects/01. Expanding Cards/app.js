const boxes = document.querySelectorAll(".box")
boxes.forEach(box =>{
  box.addEventListener("click", e => {
    removeClassFromAllBoxes("active")
    box.classList.add("active")
  })
})
function removeClassFromAllBoxes(className) {
  boxes.forEach(box => {
    box.classList.remove(className)
  })
}