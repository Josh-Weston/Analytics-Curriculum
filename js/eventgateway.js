//http://www.datchley.name/es6-eventemitter/
export class EventGateway {
    constructor() {
        this.listeners = new Map();
        document.addEventListener('click', e => {

            //TODO: This needs to be more robust because the event
            //won't fire if the user clicks on text.
            switch (Object.keys(e.target.dataset)[0]) {
                case 'headerlink':
                    this.emit('changeView', e.target.dataset['headerlink']);
                    break;
                case 'courseview':
                    this.emit('changeView', 'courseTemplate'); //TODO: Replace with actual course
                    break;
                case 'skillsview':
                    this.emit('changeView', 'skills');
                case 'avatar':
                    this.emit('selectAvatar', e.target);
                    break;
                case 'registrationdetails':
                    this.emit('registrationDetails', e);
            }
        });

        document.addEventListener('wheel', e => {
            let courseMap = document.querySelector('#coursemap-svg');
            if (e.path.find(el => el === courseMap)) {
                this.emit('svgWheel', courseMap, e.wheelDelta > 0);
                e.preventDefault();
            } 
        });

        document.addEventListener('dblclick', e => {
            let courseMap = document.querySelector('#coursemap-svg');
                if (e.path.find(el => el === courseMap)) {
                    this.emit('svgWheel', courseMap, true);
                }
        });

        document.addEventListener('mousedown', e => {
            let courseMap = document.querySelector('#coursemap-svg');
            if (e.path.find(el => el === courseMap)) {
                this.emit('svgMouseDown', true, e);
                e.preventDefault();
            } else {
                this.emit('svgMouseDown', false, null);
            }
        });

        document.addEventListener('mouseup', e => {
            this.emit('svgMouseUp');
        });

        document.addEventListener('mousemove', e => {
            let courseMap = document.querySelector('#coursemap-svg');
            if (e.path.find(el => el === courseMap)) {
                this.emit('svgMouseMove', courseMap, e);
            }
        });
    }

    //Subscribe objects to the events
    addListener(event, callback) {
        this.listeners.has(event) || this.listeners.set(event, []);
        this.listeners.get(event).push(callback);
    }

    //Notify objects listening for this event
    emit(event, ...args) {
        let listeners = this.listeners.get(event);
        if (listeners && listeners.length) {
            listeners.forEach((listener) => {
                listener(...args); 
            });
        }
    }
}