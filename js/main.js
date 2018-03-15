console.log(navigator.userAgent); //TODO: Parse out Chrome



class VM {





}


/* TODO: need to create routing with #'s */
class GUI {

    //Mostly for binding event listeners.
    constructor() {
        this.svgDrag = {
            active: false,
            lastX: undefined,
            lastY: undefined
        };

        document.addEventListener('click', e => {
            switch (Object.keys(e.target.dataset)[0]) {
                case 'headerlink':
                    this.changeView(e.target.dataset['headerlink']);
                    break;
                case 'courseview':
                    this.changeView('courseTemplate', e.target.dataset['courseview']);
                    break;
            }
        });

        document.addEventListener('wheel', e => {
            let courseMap = document.querySelector('#coursemap-svg');
            if (e.path.find(el => el === courseMap)) {
                this.zoomCourseMap(courseMap, e.wheelDelta > 0);
                e.preventDefault();
            } 
        });

        document.addEventListener('dblclick', e => {
            let courseMap = document.querySelector('#coursemap-svg');
                if (e.path.find(el => el === courseMap)) {
                    this.zoomCourseMap(courseMap, true);
                }
        });

        document.addEventListener('mousedown', e => {
            let courseMap = document.querySelector('#coursemap-svg');
            if (e.path.find(el => el === courseMap)) {
                this.svgDrag.active = true;
                this.svgDrag.lastX = e.offsetX;
                this.svgDrag.lastY = e.offsetY;
                e.preventDefault();
            } else {
                this.svgDrag.active = false;
            }
        });

        document.addEventListener('mouseup', e => {
            this.svgDrag.active = false;
        });

        document.addEventListener('mousemove', e => {
            let courseMap = document.querySelector('#coursemap-svg');
            if (e.path.find(el => el === courseMap) && this.svgDrag.active === true) {
                this.dragCourseMap(courseMap, e.offsetX, e.offsetY);
            }
        });

    }

    zoomCourseMap(courseMapSVG, zoomIn) {
        let viewBox = courseMapSVG.getAttribute('viewBox').split(' '),
            viewBoxOld = Array.from(viewBox),
            increment = .05;

        if (zoomIn) {
            viewBox[2] *= (1 - increment);
            viewBox[3] *= (1 - increment);
        } else {
            viewBox[2] *= (1 + increment);
            viewBox[3] *= (1 + increment);
        }

        //TODO: If I want animation, I will need to manually call requestanimationframe.
        courseMapSVG.setAttribute('viewBox', viewBox.join(' '));

    }

    dragCourseMap(courseMapSVG, offsetX, offsetY) {
        let viewBox = courseMapSVG.getAttribute('viewBox').split(' '),
            sensitivity = 20;

        viewBox = viewBox.map(num => +num); 
        viewBox[0] += Math.ceil(((offsetX - this.svgDrag.lastX)*-1)/sensitivity); //Invert for desired effect
        viewBox[1] += Math.ceil(((offsetY - this.svgDrag.lastY)*-1)/sensitivity); //Invert for desired effect
        courseMapSVG.setAttribute('viewBox', viewBox.join(' '));
    }

    changeView(viewName, params) {
        let mainContainer = document.querySelector('#main-container');
        mainContainer.style.opacity = 0;

        //TODO: We need our routing here!
        let url = `./${viewName}.html` + (params != undefined ? `?${params}` : '');
        console.log(url);
        fetch(url)
        .then(response => response.text())
        .then(parsed => {
            mainContainer.addEventListener('transitionend', function transitionEnd(e) {
                e.target.style.opacity = 1;
                e.target.innerHTML = parsed;
                e.target.removeEventListener('transitionend', transitionEnd);
            });
        });
    }
}

var gui = new GUI();