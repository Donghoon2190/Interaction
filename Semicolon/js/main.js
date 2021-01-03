(() => {

	let yOffset = 0; // window.pageYOffset 대신 쓸 변수
	let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
	let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
	let enterNewScene = false; // 새로운 scene이 시작된 순간 true
	let acc = 0.2;
	let delayedYOffset = 0;
	let rafId;
	let rafState;

	const sceneInfo = [
		{
			// 0
			type: 'sticky',
			heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-0'),
				messageA: document.querySelector('#scroll-section-0 .main-message.a'),
				messageB: document.querySelector('#scroll-section-0 .main-message.b'),
				messageC: document.querySelector('#scroll-section-0 .main-message.c'),
				messageD: document.querySelector('#scroll-section-0 .main-message.d'),
				canvas: document.querySelector('#video-canvas-0'),
				context: document.querySelector('#video-canvas-0').getContext('2d'),
				videoImages: []
			},
			values: {
				videoImageCount: 300,
				imageSequence: [0, 299],
				canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
				messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
				messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
				messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
				messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
				messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
				messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
				messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
				messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
				messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
				messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
				messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
				messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
				messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
				messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
				messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
				messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }]
			}
		},
		{
			// 1
			type: 'normal',
			// heightNum: 5, // type normal에서는 필요 없음
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-1')
			}
		},
		{
			// #####2
			type: 'sticky',
			heightNum: 5,
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-2'),
				messageA: document.querySelector('#scroll-section-2 .a'),
				messageB: document.querySelector('#scroll-section-2 .b'),
				messageC: document.querySelector('#scroll-section-2 .c'),
				canvas1: document.querySelector('#image-canvas-1'),
				canvas2: document.querySelector('#image-canvas-2'),
				canvas3: document.querySelector('#image-canvas-3'),
				context1: document.querySelector('#image-canvas-1').getContext('2d'),
				context2: document.querySelector('#image-canvas-2').getContext('2d'),
				context3: document.querySelector('#image-canvas-3').getContext('2d'),
				videoImages: [],
				imagesPath: [
					'./images/love.jpg',
					'./images/friend.jpg',
					'./images/groub.jpg',
				],
				images: []
			},
			values: {
				videoImageCount: 960,
				imageSequence: [0, 959],
				canvas1_opacity_in: [0, 1, { start: 0.07, end: 0.35 }],
				canvas1_opacity_out: [1, 0, { start: 0.4, end: 0.45 }],
				canvas1_translateY_in: [5, 0, { start: 0.07, end: 0.35 }],
				canvas1_translateY_out: [0, -5, { start: 0.4, end: 0.45 }],
				canvas2_opacity_in: [0, 1, { start: 0.45, end: 0.6 }],
				canvas2_opacity_out: [1, 0, { start: 0.6, end: 0.65 }],
				canvas2_translateY_in: [5, 0, { start: 0.45, end: 0.6 }],
				canvas2_translateY_out: [0, -5, { start: 0.6, end: 0.65 }],
				canvas3_opacity_in: [0, 1, { start: 0.65, end: 0.8 }],
				canvas3_opacity_out: [1, 0, { start: 0.8, end: 0.9 }],
				canvas3_translateY_in: [5, 0, { start: 0.65, end: 0.8 }],
				canvas3_translateY_out: [0, -5, { start: 0.8, end: 0.9 }],

				messageA_translateY_in: [20, 0, { start: 0.2, end: 0.35 }],
				messageB_translateY_in: [30, 0, { start: 0.45, end: 0.6 }],
				messageC_translateY_in: [30, 0, { start: 0.65, end: 0.8 }],
				messageA_opacity_in: [0, 1, { start: 0.2, end: 0.35 }],
				messageB_opacity_in: [0, 1, { start: 0.45, end: 0.6 }],
				messageC_opacity_in: [0, 1, { start: 0.65, end: 0.8 }],
				messageA_translateY_out: [0, -20, { start: 0.4, end: 0.45 }],
				messageB_translateY_out: [0, -20, { start: 0.6, end: 0.65 }],
				messageC_translateY_out: [0, -20, { start: 0.8, end: 0.9 }],
				messageA_opacity_out: [1, 0, { start: 0.4, end: 0.45 }],
				messageB_opacity_out: [1, 0, { start: 0.6, end: 0.65 }],
				messageC_opacity_out: [1, 0, { start: 0.8, end: 0.9 }],
				canvas1_scale_in: [-0.05, 0, { start: 0.2, end: 0.35 }],
				canvas2_scale_in: [-0.05, 0, { start: 0.45, end: 0.6 }],
				canvas3_scale_in: [-0.05, 0, { start: 0.65, end: 0.8 }],
			}
		},
		{
			// 3
			type: 'sticky',
			heightNum: 6,
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-3'),
				messageA: document.querySelector('#scroll-section-3 .a'),
				messageB: document.querySelector('#scroll-section-3 .b'),
				messageC: document.querySelector('#scroll-section-3 .c'),
				messageD: document.querySelector('#scroll-section-3 .d'),
				canvasCaption: document.querySelector('.canvas-caption'),
				canvas4: document.querySelector('#image-canvas-4'),
				context4: document.querySelector('#image-canvas-4').getContext('2d'),
				canvas5: document.querySelector('#image-canvas-5'),
				context5: document.querySelector('#image-canvas-5').getContext('2d'),
				canvas6: document.querySelector('#image-canvas-6'),
				context6: document.querySelector('#image-canvas-6').getContext('2d'),

				imagesPath: [
					'./images/traffic3.jpg',
					'./images/traffic2.jpg',
					'./images/traffic1.jpg'
				],
				images: []
			},
			values: {

				canvas4_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
				canvas4_opacity_out: [1, 0, { start: 0.25, end: 0.35 }],

				canvas5_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
				canvas5_opacity_out: [1, 0, { start: 0.45, end: 0.55 }],

				canvas6_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
				canvas6_opacity_out: [1, 0, { start: 0.65, end: 0.75 }],

				messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
				messageB_translateY_in: [30, 0, { start: 0.3, end: 0.4 }],
				messageC_translateY_in: [30, 0, { start: 0.5, end: 0.6 }],
				messageD_translateY_in: [30, 0, { start: 0.7, end: 0.8 }],

				messageA_translateY_out: [0, -20, { start: 0.25, end: 0.35 }],
				messageB_translateY_out: [0, -20, { start: 0.45, end: 0.55 }],
				messageC_translateY_out: [0, -20, { start: 0.65, end: 0.75 }],
				messageD_translateY_out: [0, -20, { start: 0.85, end: 1}],

				messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
				messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
				messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
				messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],

				messageA_opacity_out: [1, 0, { start: 0.25, end: 0.35 }],
				messageB_opacity_out: [1, 0, { start: 0.45, end: 0.55 }],
				messageC_opacity_out: [1, 0, { start: 0.65, end: 0.75 }],
				messageD_opacity_out: [1, 0, { start: 0.85, end: 1 }],

			}
		}
	];

	function setCanvasImages() {
		let imgElem;
		for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
			imgElem = new Image();
			imgElem.src = `./video/001/IMG_${6726 + i}.JPG`;
			sceneInfo[0].objs.videoImages.push(imgElem);
		}

		let imgElem2;
		for (let i = 0; i < sceneInfo[2].values.videoImageCount; i++) {
			imgElem2 = new Image();
			imgElem2.src = `./video/002/IMG_${7027 + i}.JPG`;
			sceneInfo[2].objs.videoImages.push(imgElem2);
		}
		let imgElem1;
		for (let i = 0; i < sceneInfo[2].objs.imagesPath.length; i++) {
			imgElem1 = new Image();
			imgElem1.src = sceneInfo[2].objs.imagesPath[i];
			sceneInfo[2].objs.images.push(imgElem1);
		}
		let imgElem3;
		for (let i = 0; i < sceneInfo[3].objs.imagesPath.length; i++) {
			imgElem3 = new Image();
			imgElem3.src = sceneInfo[3].objs.imagesPath[i];
			sceneInfo[3].objs.images.push(imgElem3);
		}
	}

	function checkMenu() {
		if (yOffset > 44) {
			document.body.classList.add('local-nav-sticky');
		} else {
			document.body.classList.remove('local-nav-sticky');
		}
	}

	function setLayout() {
		// 각 스크롤 섹션의 높이 세팅
		for (let i = 0; i < sceneInfo.length; i++) {
			if (sceneInfo[i].type === 'sticky') {
				sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
			} else if (sceneInfo[i].type === 'normal')  {
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
			}
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
		}

		yOffset = window.pageYOffset;

		let totalScrollHeight = 0;
		for (let i = 0; i < sceneInfo.length; i++) {
			totalScrollHeight += sceneInfo[i].scrollHeight;
			if (totalScrollHeight >= yOffset) {
				currentScene = i;
				break;
			}
		}
		document.body.setAttribute('id', `show-scene-${currentScene}`);

		const heightRatio = window.innerHeight / 1080;
		sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
		// 동훈이가 수정해또욤
		sceneInfo[2].objs.context1.drawImage(sceneInfo[2].objs.images[0],0, 0);
		sceneInfo[2].objs.context2.drawImage(sceneInfo[2].objs.images[1],0, 0);
		sceneInfo[2].objs.context3.drawImage(sceneInfo[2].objs.images[2],0, 0);
		sceneInfo[3].objs.context4.drawImage(sceneInfo[3].objs.images[0],0, 0);
		sceneInfo[3].objs.context5.drawImage(sceneInfo[3].objs.images[1],0, 0);
		sceneInfo[3].objs.context6.drawImage(sceneInfo[3].objs.images[2],0, 0);

	}

	function calcValues(values, currentYOffset) {
		let rv;
		// 현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기
		const scrollHeight = sceneInfo[currentScene].scrollHeight;
		const scrollRatio = currentYOffset / scrollHeight;

		if (values.length === 3) {
			// start ~ end 사이에 애니메이션 실행
			const partScrollStart = values[2].start * scrollHeight;
			const partScrollEnd = values[2].end * scrollHeight;
			const partScrollHeight = partScrollEnd - partScrollStart;

			if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
				rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
			} else if (currentYOffset < partScrollStart) {
				rv = values[0];
			} else if (currentYOffset > partScrollEnd) {
				rv = values[1];
			}
		} else {
			rv = scrollRatio * (values[1] - values[0]) + values[0];
		}

		return rv;
	}

	function playAnimation() {
		const objs = sceneInfo[currentScene].objs;
		const values = sceneInfo[currentScene].values;
		const currentYOffset = yOffset - prevScrollHeight;
		const scrollHeight = sceneInfo[currentScene].scrollHeight;
		const scrollRatio = currentYOffset / scrollHeight;

		switch (currentScene) {
			case 0:
				// console.log('0 play');
				// let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
				// objs.context.drawImage(objs.videoImages[sequence], 0, 0);
				objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);

				if (scrollRatio <= 0.22) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.42) {
					// in
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.62) {
					// in
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.82) {
					// in
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
				}

				break;

			case 2:

				objs.container.style.background = "black";
				const kwidthRatio = window.innerWidth / objs.canvas1.width;
				const kheightRatio = window.innerHeight / objs.canvas1.height;
				let kcanvasScaleRatio;

				if (kwidthRatio <= kheightRatio) {
					// 캔버스보다 브라우저 창이 홀쭉한 경우
					kcanvasScaleRatio = kheightRatio;
				} else {
					// 캔버스보다 브라우저 창이 납작한 경우
					kcanvasScaleRatio = kwidthRatio;
				}
				objs.messageA.style.color = 'white';
				if (scrollRatio <= 0.35) {
					// in
					
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
					objs.canvas1.style.opacity = calcValues(values.canvas1_opacity_in, currentYOffset);
					objs.canvas1.style.transform = `translate3d(-50%, ${calcValues(values.canvas1_translateY_in, currentYOffset)-55}%, 0) 
					scale(${kcanvasScaleRatio*0.5 + calcValues(values.canvas1_scale_in, currentYOffset)})`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
					objs.canvas1.style.opacity = calcValues(values.canvas1_opacity_out, currentYOffset);
					objs.canvas1.style.transform = `translate3d(-50%, ${calcValues(values.canvas1_translateY_out, currentYOffset)-55}%, 0) scale(${kcanvasScaleRatio*0.5})`;
				}

				if (scrollRatio <= 0.6) {
					// in
					objs.messageB.style.color = 'white';
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.canvas2.style.opacity = calcValues(values.canvas2_opacity_in, currentYOffset);
					objs.canvas2.style.transform = `translate3d(-39%, ${calcValues(values.canvas2_translateY_in, currentYOffset)-50}%, 0) scale(${kcanvasScaleRatio*0.5 + calcValues(values.canvas2_scale_in, currentYOffset)})`;
				} else {
					// out
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objs.canvas2.style.opacity = calcValues(values.canvas2_opacity_out, currentYOffset);
					objs.canvas2.style.transform = `translate3d(-39%, ${calcValues(values.canvas2_translateY_out, currentYOffset)-50}%, 0) scale(${kcanvasScaleRatio*0.5})`;
				}

				if (scrollRatio <= 0.8) {
					// in
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objs.canvas3.style.opacity = calcValues(values.canvas3_opacity_in, currentYOffset);
					objs.canvas3.style.transform = `translate3d(-46%, ${calcValues(values.canvas3_translateY_in, currentYOffset)-50}%, 0) scale(${kcanvasScaleRatio*0.5 + calcValues(values.canvas3_scale_in, currentYOffset)})`;
				} else {
					// out
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					objs.canvas3.style.opacity = calcValues(values.canvas3_opacity_out, currentYOffset);
					objs.canvas3.style.transform = `translate3d(-46%, ${calcValues(values.canvas3_translateY_out, currentYOffset)-50}%, 0) scale(${kcanvasScaleRatio*0.5})`;
					
					sceneInfo[3].objs.container.style.background = "black";
				}

				

				break;

			case 3:
				// 가로/세로 모두 꽉 차게 하기 위해 여기서 세팅(계산 필요)
				const widthRatio = window.innerWidth / objs.canvas4.width;
				const heightRatio = window.innerHeight / objs.canvas4.height;
				let canvasScaleRatio;

				if (widthRatio <= heightRatio) {
					// 캔버스보다 브라우저 창이 홀쭉한 경우
					canvasScaleRatio = heightRatio;
				} else {
					// 캔버스보다 브라우저 창이 납작한 경우
					canvasScaleRatio = widthRatio;
				}
				sceneInfo[3].objs.container.style.background = "black";
				if (scrollRatio <= 0.22) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(20%, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
					objs.canvas4.style.opacity = calcValues(values.canvas4_opacity_in, currentYOffset);
					objs.canvas4.style.transform = `scale(${canvasScaleRatio*0.5}) translate3d(-115%,-105%,0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(20%, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
					objs.canvas4.style.opacity = calcValues(values.canvas4_opacity_out, currentYOffset);
					objs.canvas4.style.transform = `scale(${canvasScaleRatio*0.5}) translate3d(-115%,-105%,0)`;
				}

				if (scrollRatio <= 0.42) {
					// in
					objs.messageB.style.transform = `translate3d(20%, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.canvas5.style.opacity = calcValues(values.canvas5_opacity_in, currentYOffset);
					objs.canvas5.style.transform = `scale(${canvasScaleRatio*0.5}) translate3d(-115%,-105%,0)`;
				} else {
					// out
					objs.messageB.style.transform = `translate3d(20%, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objs.canvas5.style.opacity = calcValues(values.canvas5_opacity_out, currentYOffset);
					objs.canvas5.style.transform = `scale(${canvasScaleRatio*0.5}) translate3d(-115%,-105%,0)`;
				}

				if (scrollRatio <= 0.62) {
					// in
					objs.messageC.style.transform = `translate3d(20%, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objs.canvas6.style.opacity = calcValues(values.canvas6_opacity_in, currentYOffset);
					objs.canvas6.style.transform = `scale(${canvasScaleRatio*0.5}) translate3d(-115%,-105%,0)`;
				} else {
					// out
					objs.messageC.style.transform = `translate3d(20%, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					objs.canvas6.style.opacity = calcValues(values.canvas6_opacity_out, currentYOffset);
					objs.canvas6.style.transform = `scale(${canvasScaleRatio*0.5}) translate3d(-115%,-105%,0)`;
					
				}
				if (scrollRatio <= 0.82) {
					// in
					objs.messageD.style.transform = `translate3d(20%, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);

				} else {
					// out
					objs.messageD.style.transform = `translate3d(20%, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);

					
				}
				

				break;
		}
	}

	function scrollLoop() {
		enterNewScene = false;
		prevScrollHeight = 0;

		for (let i = 0; i < currentScene; i++) {
			prevScrollHeight += sceneInfo[i].scrollHeight;
		}

		if (delayedYOffset < prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
			document.body.classList.remove('scroll-effect-end');
		}

		if (delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
			enterNewScene = true;
			if (currentScene === sceneInfo.length - 1) {
				document.body.classList.add('scroll-effect-end');
			}
			if (currentScene < sceneInfo.length - 1) {
				currentScene++;
			}
			document.body.setAttribute('id', `show-scene-${currentScene}`);
		}

		if (delayedYOffset < prevScrollHeight) {
			enterNewScene = true;
			// 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
			if (currentScene === 0) return;
			currentScene--;
			document.body.setAttribute('id', `show-scene-${currentScene}`);
		}

		if (enterNewScene) return;

		playAnimation();
	}

	function loop() {
		delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;

		if (!enterNewScene) {
			if (currentScene === 0) {
				const currentYOffset = delayedYOffset - prevScrollHeight;
				const objs = sceneInfo[currentScene].objs;
				const values = sceneInfo[currentScene].values;
				let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
				if (objs.videoImages[sequence]) {
					objs.context.drawImage(objs.videoImages[sequence], 0, 0);
				}
			}
		}

        // 일부 기기에서 페이지 끝으로 고속 이동하면 body id가 제대로 인식 안되는 경우를 해결
        // 페이지 맨 위로 갈 경우: scrollLoop와 첫 scene의 기본 캔버스 그리기 수행
        if (delayedYOffset < 1) {
            scrollLoop();
            sceneInfo[0].objs.canvas.style.opacity = 1;
            sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
        }
        // 페이지 맨 아래로 갈 경우: 마지막 섹션은 스크롤 계산으로 위치 및 크기를 결정해야할 요소들이 많아서 1픽셀을 움직여주는 것으로 해결
        if ((document.body.offsetHeight - window.innerHeight) - delayedYOffset < 1) {
            let tempYOffset = yOffset;
            scrollTo(0, tempYOffset - 1);
        }

		rafId = requestAnimationFrame(loop);

		if (Math.abs(yOffset - delayedYOffset) < 1) {
			cancelAnimationFrame(rafId);
			rafState = false;
		}
	}

	window.addEventListener('load', () => {
		setLayout(); // 중간에 새로고침 시, 콘텐츠 양에 따라 높이 계산에 오차가 발생하는 경우를 방지하기 위해 before-load 클래스 제거 전에도 확실하게 높이를 세팅하도록 한번 더 실행
        document.body.classList.remove('before-load');
        setLayout();
        sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);

		// 중간에서 새로고침 했을 경우 자동 스크롤로 제대로 그려주기
        let tempYOffset = yOffset;
        let tempScrollCount = 0;
        if (tempYOffset > 0) {
            let siId = setInterval(() => {
                scrollTo(0, tempYOffset);
                tempYOffset += 5;

                if (tempScrollCount > 20) {
                    clearInterval(siId);
                }
                tempScrollCount++;
            }, 20);
        }

        window.addEventListener('scroll', () => {
            yOffset = window.pageYOffset;
            scrollLoop();
  			checkMenu();

  			if (!rafState) {
  				rafId = requestAnimationFrame(loop);
  				rafState = true;
  			}
  		});

  		window.addEventListener('resize', () => {
  			if (window.innerWidth > 900) {
				window.location.reload();
			}
  		});

  		window.addEventListener('orientationchange', () => {
			scrollTo(0, 0);
			setTimeout(() => {
				window.location.reload();
			}, 500);
  		});

  		document.querySelector('.loading').addEventListener('transitionend', (e) => {
  			document.body.removeChild(e.currentTarget);
  		});

	});

	setCanvasImages();

})();
