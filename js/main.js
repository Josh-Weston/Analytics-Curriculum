console.log(navigator.userAgent); //TODO: Parse out Chrome

class VM {

    constructor(gui) {
        this.gui = gui;
        this.gui.changeView('home');
        if (navigator.userAgent.indexOf('Chrome/') < 0) {
            this.gui.showBrowserWarning();
        }
    }

}


/* TODO: need to create routing with #'s */
class GUI {

    constructor(eventGateway) {

        this.eventGateway = eventGateway;
        this.eventGateway.addListener('changeView', data => this.changeView(data));
        this.eventGateway.addListener('selectAvatar', data => this.selectAvatar(data));

        $('[data-toggle="tooltip"]').tooltip();


        document.querySelectorAll('.registration-details').forEach(el => {
            el.addEventListener('click', e => {
                console.log(e.target);
            });
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

    changeView(viewName, params) {
        let mainContainer = document.querySelector('#main-container');
        mainContainer.style.opacity = 0;

        //TODO: We need our routing here!
        let url = `./${viewName}.html` + (params != undefined ? `?${params}` : '');
        console.log(url);
        fetch(url)
            .then(response => response.text())
            .then(parsed => {
                    let thisGui = this;
                    mainContainer.addEventListener('transitionend', function transitionEnd(e) {
                    e.target.style.opacity = 1;
                    e.target.innerHTML = parsed;
                    e.target.removeEventListener('transitionend', transitionEnd);

                    if (url === './home.html') {
                        thisGui.eventGateway.emit('homeLoaded');
                    }

                });
            });
    }

    /* Will receive instructions for what components are required */
    /* Body should be passed into this */
    buildModal() {

    }
}

import {EventGateway} from './eventgateway.js';
import {CourseMap} from './coursemap.js';
import {Schedule} from './schedule.js';
import {Skills} from './skills.js';
import {Home} from './home.js';

let gateway = new EventGateway();
var gui = new GUI(gateway);
var vm = new VM(gui);
gui.vm = vm;

let courseMap = new CourseMap(gateway);
let schedule = new Schedule(gateway);
let skills = new Skills(gateway);
let home = new Home(gateway);

