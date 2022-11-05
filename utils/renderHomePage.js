
function renderHomePage(lessons, jumpPage){
  	const contentGlass = document.querySelector(".content-glass")
	
	let allItems = document.createElement("div")
	lessons.forEach(lesson=>{
		let eachSection  = document.createElement("div")
		let eachSectionTitle  = document.createElement("li")
		let eachSectionItems  = document.createElement("ul")
		eachSectionItems.classList.add("lesson_list")
		eachSectionTitle.innerText = lesson.label
		eachSection.appendChild(eachSectionTitle)
		eachSection.appendChild(eachSectionItems)
		
		lesson.items.map(item=>{
			const liItem = document.createElement("li")
			const button = document.createElement("button")
			button.innerText = item.label
			button.addEventListener("click", jumpPage)
			button.setAttribute("data-target", "/?section="+ lesson.label +"&lesson="+item.label)
			liItem.appendChild(button)
			eachSectionItems.appendChild(liItem)
		})
		allItems.appendChild(eachSection)
	})
	
	let div = document.createElement("div")
	let title  = document.createElement("h1")
	title.innerText = "Lessons"
	title.classList.add("title")
	div.appendChild(title)
	div.appendChild(allItems)
	contentGlass.innerHTML = null
	contentGlass.appendChild(div)
	
	setTimeout(()=>{
		const homepage = document.querySelector(".homepage")
		homepage.style.height = (c) +'px'
		btn = document.querySelectorAll("button")
	}, 0)
}
export default renderHomePage