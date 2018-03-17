console.log(navigator.userAgent); //TODO: Parse out Chrome

class VM {

    constructor(gui) {
        this.gui = gui;
        this.fetchProfile(true);

        if (navigator.userAgent.indexOf('Chrome/') < 0) {
            this.gui.showBrowserWarning();
        }
    }

    fetchProfile(profileExists) {
        if (profileExists) {
            this.gui.removeSignup();
            this.gui.welcomeBack();
        } else {
            this.gui.showSignup();
        }
        
    }

    saveProfileChanges() {

    }

    signup() {

    }

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

        $('[data-toggle="tooltip"]').tooltip();

        document.addEventListener('click', e => {

            //TODO: This needs to be more robust because the event
            //won't fire if the user clicks on text.
            switch (Object.keys(e.target.dataset)[0]) {
                case 'headerlink':
                    this.changeView(e.target.dataset['headerlink']);
                    break;
                case 'courseview':
                    this.changeView('courseTemplate', e.target.dataset['courseview']);
                    break;
                case 'skillsview':
                    this.changeView('skills');
                case 'avatar':
                    this.selectAvatar(e.target);
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

    //TODO: These modal messages need to be a separate object for simplicity
    welcomeBack() {
        $('#information-modal').modal('show');
    }

    showBrowserWarning() {
        //TODO: Pass it browser specific message here.
        //Dang! I see your browser isn't Chrome, but this site is build on latest
        //HTMl 5.0 features. If this becomes an issue, we will make the site 
        //cross browser compatible, but for now I suggest firing up Chrome
        $('#information-modal').modal('show');
    }

    selectAvatar(target) {
        document.querySelectorAll('.main-container-avatar').forEach(avatar => {
            if (avatar === target) {
                avatar.classList.remove('main-container-avatar--notselected');
            } else {
                avatar.classList.add('main-container-avatar--notselected');
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

    /* Will receive instructions for what components are required */
    /* Body should be padded into this */
    buildModal() {

    }

    removeSignup() {
        const signup = document.querySelector('#main-container-signup');
        document.querySelector('#main-container-illustration').removeChild(signup);
        document.querySelector('#main-container-svg').style.width = "1200px";
        document.querySelector('#svg-mountain-parent').style.width = "1200px";
    }

    showSignup() {
        const signup = document.querySelector('#main-container-signup');
        signup.style.display = "inline-block";
    }
}

/* Instantiate for loose coupling */
var gui = new GUI();
var vm = new VM(gui);
gui.vm = vm;