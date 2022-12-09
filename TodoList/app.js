// 待办项的父元素
let sectionElement = document.querySelector("section")
// 待办项
let todoList = []
let todoIdx = localStorage.getItem("todo_idx") === null ? 0 : Number(localStorage.getItem("todo_idx"))
if(localStorage.getItem("todo_list") !== null) {
  todoList = JSON.parse(localStorage.getItem("todo_list"))
  // 初始化LocalStorage中的待办
  rebuildTodoList()
}
if(todoList.length === 0) {
  todoIdx = 0
  localStorage.setItem("todo_idx", "0")
}

// 添加待办项按钮和绑定的事件
let submitBtn = document.querySelector("form.todo-adds button")
submitBtn.addEventListener("click", (e) => {
  e.preventDefault()
  // text, date, time
  let formElement = e.target.parentElement
  let todoText = formElement.children[0].value
  let todoMonth = formElement.children[1].value
  let todoDay = formElement.children[2].value

  let todoItemAndErr = createTodoItem(todoIdx, todoText, todoMonth, todoDay)
  if(todoItemAndErr["err"] !== undefined) {
    alert(todoItemAndErr["err"])
  }else {
    let todo = {idx: todoIdx, text: todoText, month: todoMonth, day: todoDay, complete: false}
    todoList.push(todo)
    window.localStorage.setItem("todo_list", JSON.stringify(todoList))
    todoIdx += 1
    window.localStorage.setItem("todo_idx", todoIdx)

    sectionElement.appendChild(todoItemAndErr["el"])
  }
})

/**
 * <div class="todo-item">
 *  <p class="todo-item-text">Learn Java</p>
 *  <p class="todo-item-time">12-24</p>
 *  <button class="todo-item-complete-btn"><i class="fa-solid fa-check"></i></button>
 *  <button class="todo-item-delete-btn"><i class="fa-solid fa-trash"></i></button>
 * </div>
 *
 * isComplete: <div class="todo-item todo-item-complete">
 */
function createTodoItem(todoIdx, todoText, todoMonth, todoDay, isComplete=false) {
  // 参数校验
  if(todoText === null || todoText.length === 0) {
    return {
      err: "待办项内容不能为空"
    }
  }
  if(todoMonth < 1 || todoMonth > 12) {
    return {
      err: "月的范围是[1, 12]"
    }
  }
  if(todoDay < 1 || todoDay > 31) {
    return {
      err: "天的范围是[1, 31]"
    }
  }

  let todoItemText = document.createElement("p")
  todoItemText.innerText = todoText
  todoItemText.classList.add("todo-item-text")
  let todoItemTime = document.createElement("p")
  todoItemTime.innerText = (todoMonth >= 10 ? "" : "0") + todoMonth + "-" + (todoDay <= 9 ? "0" : "") + todoDay
  todoItemTime.classList.add("todo-item-time")
  let todoItemCompleteBtn = document.createElement("button")
  todoItemCompleteBtn.innerHTML = '<i class="fa-solid fa-check"></i>'
  todoItemCompleteBtn.classList.add("todo-item-complete-btn")
  // 添加点击之后完成/未完成事件
  todoItemCompleteBtn.addEventListener("click", e => {
    let parent = e.target.parentElement
    parent.classList.toggle("todo-item-complete")
    // 更新LocalStorage中的complete属性
    let parentId = Number(parent.id.split("#")[1])
    for(let idx = 0; idx < todoList.length; idx++) {
      if(todoList[idx].idx === parentId) {
        todoList[idx]["complete"] = !todoList[idx]["complete"]
      }
    }
    window.localStorage.setItem("todo_list", JSON.stringify(todoList))
  })
  let todoItemDeleteBtn = document.createElement("button")
  todoItemDeleteBtn.innerHTML = '<i class="fa-solid fa-trash">'
  todoItemDeleteBtn.classList.add("todo-item-delete-btn")
  // 添加点击之后删除元素的事件
  todoItemDeleteBtn.addEventListener("click", e => {
    let parent = e.target.parentElement
    // 从LocalStorage中删除
    let parentId = Number(parent.id.split("#")[1])
    for(let idx = 0; idx < todoList.length; idx++) {
      if(todoList[idx].idx === parentId) {
        todoList.splice(idx, 1)
        break
      }
    }
    window.localStorage.setItem("todo_list", JSON.stringify(todoList))
    // 删除元素增加动画
    parent.style.animationName = "ScaleDown"
    // 动画结束之后删除元素
    parent.addEventListener("animationend", e => {
      parent.remove()
    })
  })

  let todoItem = document.createElement("div")
  todoItem.id = "todo#" + todoIdx
  todoItem.append(todoItemText, todoItemTime, todoItemCompleteBtn, todoItemDeleteBtn)
  todoItem.classList.add("todo-item")
  if(isComplete) {
    todoItem.classList.add("todo-item-complete")
  }

  return {
    el: todoItem
  }
}

// 添加排序按钮点击事件
document.querySelector("#todo-sort-asc").addEventListener("click", () => {
  todoList = todoList.sort(compareTodo)
  rebuildTodoList()
  window.localStorage.setItem("todo_list", JSON.stringify(todoList))
})
document.querySelector("#todo-sort-desc").addEventListener("click", () => {
  todoList = todoList.sort(compareTodo).reverse()
  rebuildTodoList()
  window.localStorage.setItem("todo_list", JSON.stringify(todoList))
})

function compareTodo(todo1, todo2){
  let m1 = Number(todo1["month"])
  let m2 = Number(todo2["month"])
  if(m1 > m2) {
    return 1
  }else if(m1 < m2) {
    return -1
  }else {
    let d1 = Number(todo1["day"])
    let d2 = Number(todo2["day"])
    if(d1 > d2) {
      return 1
    }else if(d1 < d2) {
      return -1
    }else {
      return 0
    }
  }
}

function rebuildTodoList() {
  // let len = sectionElement.children.length
  // for(let i = 0; i < len; i++) {
  //   sectionElement.children[0].remove()
  // }
  sectionElement.innerHTML = ''
  todoList.forEach(todo => {
    sectionElement.appendChild(createTodoItem(todo["idx"], todo["text"], todo["month"], todo["day"], todo["complete"])["el"])
  })
}

