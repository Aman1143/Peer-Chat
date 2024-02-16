import React, { useRef } from 'react'
import './Test.css'

import loadStream from 'loadstream-client'

const Test = () => {
	let loader = new loadStream({ host: 'http://localhost:5000' })
	loader.onerror = (e) => { console.log(e) }
	const a = useRef(0);
	const handleChange = async (e) => {

		try {
			loader.upload(e.target.files[0]);  
		} catch (error) {
			console.error("Upload error:", error);
		}

	}
	return (
		<div class="wrapper">
			<header>LoadStream</header>
			<form action="#">
				<input class="file-input" type="file" id="file" name="file" onChange={(e) => handleChange(e)} />
				<i class="fas fa-cloud-upload-alt"></i>
				<p>Browse File to Upload</p>
			</form>
			<section class="progress-area">
				<progress id="progress" value="0" max="100"> 32% </progress>
			</section>
			<div class="function">
				<div class="time">Expected Time: <span id="time" class="value">100</span>s</div>
				<div class="speed">Speed: <span id="speed" class="value">98</span>kb/s</div>
			</div>
			<div class="btn">
				<button class="button-29" role="button" id="pause">Stop</button>
				<button class="button-29" role="button" id="Resume">Resume</button>

			</div>
		</div>
	)
}

export default Test