import lessons from "./lessons.js"


const refresh = document.getElementById("refresh")
const speedMeter = document.getElementById("speed-meter")
const timeRunning = document.getElementById("time-running")

refresh.addEventListener("click", function (){
	resetProgress()
})
let startTime = new Date()
let isMute = false

isMute = !!window.localStorage.getItem("isMute")

let soundBtn = document.getElementById("toggle-sound-btn")


toggleIcon(isMute)

function toggleIcon(isMute) {
	if(isMute) {
		soundBtn.innerHTML= null
		soundBtn.innerHTML ='<i class="far fa-music-slash" ></i>'
		soundBtn.classList.add('mute')
	} else {
		soundBtn.classList.remove('mute')
		soundBtn.innerHTML= null
		soundBtn.innerHTML ='<i class="far fa-music" ></i>'
	}
}

soundBtn.addEventListener("click", ()=>{
	let isMutea = soundBtn.classList.contains('mute')
	if(isMutea){
		toggleIcon(false)
		isMute = false
		window.localStorage.setItem("isMute", "")
	} else {
		isMute = true
		toggleIcon(true)
		window.localStorage.setItem("isMute", "true")
	}
})


const contentGlass = document.querySelector(".content-glass")
let c = (window.innerHeight - (80 + 20))

contentGlass.style.height = c+'px'

let lesson = {}

let startIndex = 0;

let btn = null

function renderPageContent(search){
	if(search === ""){
		renderHomePage()
	} else {
		renderKeyboardPage()
	}
}


function qs(search) {
	let q = window.location.search.replace("?", "")
	let s = q.split("&")
	let params = {}
	s.forEach(item=>{
		let keyValArr = item.split("=")
		if(keyValArr.length > 0){
			params[keyValArr[0]]  = keyValArr[1] ? keyValArr[1] : null
		}
	})
	return params
}

renderPageContent(window.location.search)


function renderHomePage(){
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


window.addEventListener("resize", ()=>{
	const contentGlass = document.querySelector(".content-glass")
	let c = (window.innerHeight - (80 + 20))
	contentGlass.style.height = c+'px'
	const homepage = document.querySelector(".homepage")
	if(homepage) {
		homepage.style.height = (c) + 'px'
	}
})

function getLesson(lessons, sectionName, lessonName, nextIndex = -1){
	let lesson = null
	if(sectionName){
		let secIndex = lessons.findIndex(sec=>sec.label === sectionName)
		// console.log(secIndex)
		if(nextIndex !== -1){
			let nextLesson = lessons[secIndex].items[nextIndex]
			lesson = {
				...nextLesson,
				sectionName: lessons[secIndex].label,
				nextLessonIndex: (nextIndex + 1) < lessons[secIndex].items.length ? nextIndex + 1 : 0  }
		} else {
			let a = lessons[secIndex].findIndex(lesson=>lesson.label === lessonName)
			console.log(a)
			
			// if(a !== -1){
			// 	lesson = {...eachLess.items[a],
			// 		sectionName: eachLess.label,
			// 		nextLessonIndex: (a + 1) < eachLess.items.length ? a + 1 : 0 }
			// }
		}
		
	} else {
		lessons.map(eachLess=>{
			if(nextIndex !== -1){
				lesson = {...eachLess.items[nextIndex],
					sectionName: eachLess.label,
					nextLessonIndex: (nextIndex + 1) < eachLess.items.length ? nextIndex + 1 : 0  }
			} else {
				let a = eachLess.items.findIndex(lesson=>lesson.label === lessonName)
				if(a !== -1){
					lesson = {...eachLess.items[a],
						sectionName: eachLess.label,
						nextLessonIndex: (a + 1) < eachLess.items.length ? a + 1 : 0 }
				}
			}
		})
	}
	return lesson
}

function renderKeyboardPage(){
	
	let query = qs(window.location.search)
	isMute  = !!window.localStorage.getItem("isMute")
	
	lesson = getLesson(lessons, null, query.lesson)
	
	
	const a = `
	<div class="practise">
        <audio hidden id="audio" src="/static/key.mp3"></audio>
        <audio hidden id="audioError" src="/static/error.mp3"></audio>
        
        <audio id="star1"   src="./static/star1.mp3"></audio>
        <audio id="star2" src="./static/star2.mp3"></audio>
        <audio id="star3" src="./static/star3.mp3"></audio>
        
        
        <div>
          <div id="output"></div>
          <div>
            <input type="text"  id="input" placeholder="enter" >
          </div>
        </div>
      </div>
	`
	contentGlass.innerHTML = null
	contentGlass.innerHTML = a
	// setTimeout(()=>{
		initial(lesson)
	// }, 0)
}


function playStatSound(){
	
	if(!isMute) {
		let star1 = document.getElementById("star1")
		let star2 = document.getElementById("star2")
		let star3 = document.getElementById("star3")
		
		star1.play()
		
		setTimeout(() => {
			star2.play()
		}, 600)
		
		setTimeout(() => {
			star3.play()
		}, 1200)
	}
}


function makeProgress(lesson, value){
	
	const app = document.querySelector("#app")
	let letter = document.createElement("h1")
	letter.classList.add("big-letter")
	letter.innerHTML = value
	app.appendChild(letter)
	
	setTimeout(()=>{
		app.removeChild(letter)
	}, 100)
	
	if(lesson.text[startIndex].toUpperCase() === value.toUpperCase()){
		keySound()
		letter.classList.add("correct")
		let focus = document.querySelector(".focus")
		let preCaret = focus.querySelector(".caret")
		let next = focus.nextSibling
		focus.classList.remove("focus")
		focus.classList.add("passed")
		if(next) {
			next.classList.add("focus")
			next.appendChild(createCaret())
		} else {
			console.log("no next sibling ")

			playStatSound()
			
		}
		focus.removeChild(preCaret)
		startIndex += 1
		
	} else{
		letter.classList.add("wrong")
		keySound(true)
		console.log("wrong keypress")
	}
}



let isRunning = false
let time = 0
let id;

function resetProgress(){
	startIndex = 0
	startTime = null
	clearInterval(id)
	time = 0
	id = setInterval(()=>{
		time += 1
		timeRunning.innerHTML = time + "s"
	}, 1000)
	
	initial(lesson)
}


window.addEventListener("keypress", (e)=>{
	
	// if(e.shiftKey && e.key === "Enter"){
	
	if(e.key === "Enter"){
		
		if(lesson) {
			lesson = getLesson(lessons, lesson.sectionName, lesson.label, lesson.nextLessonIndex)
		} else {
			lesson = getLesson(lessons, null, lesson, 0)
		}
		window.history.pushState("asd", "asd", "/?section="+lesson.sectionName  +"&lesson="+lesson.label)
		// window.history.back()
		// window.history.pushState("asd", "asd", "/?section="+lesson.sectionName   +"&lesson="+ lesson.label)
		// window.history.pushState("asd", "asd", "/?section="+lesson.sectionName   +"&lesson="+ lesson.label)
		// window.history.back()
		
		resetProgress()
		// makeProgress( lesson, e.key)
		return;
	}
	
	
	if(startIndex === (lesson.text.length)){
		isRunning = true
		startIndex = 0
		initial(lesson);
	} else {
		// startIndex+= 1
		makeProgress( lesson, e.key)
	}
	
	if(lesson.text.length === startIndex){
		clearInterval(id)
		time = 0
		// speedMeter.innerHTML  = Math.floor(startIndex / 1) + "CPS"
	} else {
		if(startIndex > 0){
			speedMeter.innerHTML = Math.floor(startIndex / time) + "CPS"
		}
	}
})

id = setInterval(()=>{
	time += 1
	timeRunning.innerHTML = time + "s"
}, 1000)


window.addEventListener("popstate", (e)=>{
	startIndex = 0
	renderPageContent(window.location.search)
})


function initial(lesson){
	// const input = document.getElementById("input")
	// input.addEventListener("input", function (e){
	// 	if(startIndex === (text.length - 1)){
	// 		startIndex = 0
	// 		initial();
	// 	} else {
	// 		makeProgress( e.target.value)
	// 	}
	//
	// 	// makeProgress(startIndex)
	//
	// })
	
	const lessonTitle = document.getElementById("lesson-title")
	lessonTitle.innerHTML = `<h4 class="lesson-label">(${lesson.nextLessonIndex - 0}) ${lesson.label}</h4>`
	
	if(!lesson){
		return alert("please select a lesson")
	}
	
	
	const output = document.getElementById("output")
	let div = document.createElement("div")
	div.classList.add("text")
	
	lesson.text.split("").forEach((t, index)=>{
		let li = document.createElement("li")
		li.innerText = t
		if(t === " "){
			li.innerText = " "
			li.classList.add("white-space")
		}
		
		if(index === startIndex) {
			li.classList.add("focus")
			li.appendChild(createCaret())
		}
		div.appendChild(li)
	})
	output.innerHTML = null
	output.appendChild(div)
}

function keySound(isError=false){
	if(!isMute) {
		let audio = document.getElementById(isError ? "audioError" : "audio")
		audio.play()
	}
}


function createCaret(){
	let caret = document.createElement("span")
	caret.classList.add("caret")
	return caret
}



// let a = lessons.map(l=>{
// 	l.items = l.items.map(less=>{
// 		less.label = slugify(less.label)
// 		return less
// 	})
// 	return l
// })
//
//
//
// function slugify(str) {
//
// 	const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìıİłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
// 	const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
// 	const p = new RegExp(a.split('').join('|'), 'g')
// 	return str
// 		.toString().toLowerCase()
// 		.replace(/\s+/g, " ")
// 		.replace(/\s+/g, '-')
// 		.replace(/\s+/g, '-') // Replace spaces with -
// 		.replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
// 		.replace(/&/g, '-and-') // Replace & with 'and'
// 		.replace(/[^\w\-]+/g, '') // Remove all non-word characters // remove bangla word...
// 		.replace(/\-\-+/g, '-') // Replace multiple - with single -
// 		.replace(/^-+/, '') // Trim - from start of text
// 		.replace(/-+$/, '') // Trim - from end of text
// 		.replaceAll("?", "") // need node >= v16
//
// }
//
//
//






function jumpPage(e) {
	console.log(e.target.dataset.target)
	window.history.pushState("", "", e.target.dataset.target)
	// window.history.pushState("", "", b.dataset.target)
	window.history.pushState("", "", e.target.dataset.target)
	window.history.back()
}


let homeBtn = document.getElementById("homepage-btn")
	homeBtn.addEventListener("click", jumpPage)
	



