export class CourseMap {
    constructor(eventGateway) {
        
        this.eventGateway = eventGateway;
        this.eventGateway.addListener('svgWheel', (...data) => this.zoomCourseMap(...data));
        this.eventGateway.addListener('svgMouseDown', (...data) => this.setSvgActive(...data));
        this.eventGateway.addListener('svgMouseUp', () => this.setSvgActive(false));
        this.eventGateway.addListener('svgMouseMove', (...data) => this.setSvgPan(...data));
        this.eventGateway.addListener('svgDblClick', (...data) => this.zoomCourseMap(...data));

        this.svgDrag = {
            active: false,
            lastX: undefined,
            lastY: undefined
        };
    }

    zoomCourseMap(courseMapSVG, zoomIn) {

        let viewBox = courseMapSVG.getAttribute('viewBox').split(' '),
            viewBoxOld = Array.from(viewBox),
            increment = .05;

        if (zoomIn === true) {
            viewBox[2] *= (1 - increment);
            viewBox[3] *= (1 - increment);
        } else {
            viewBox[2] *= (1 + increment);
            viewBox[3] *= (1 + increment);
        }

        //TODO: If I want animation, I will need to manually call requestanimationframe.
        courseMapSVG.setAttribute('viewBox', viewBox.join(' '));

    }

    setSvgActive(activeFlag, e) {
        this.svgDrag.active = activeFlag;
        if (activeFlag === true) {
            this.svgDrag.lastX = e.offsetX;
            this.svgDrag.lastY = e.offsetY;
        }
    }

    setSvgPan(courseMapSVG, e) {
        if (this.svgDrag.active === true) {
            let viewBox = courseMapSVG.getAttribute('viewBox').split(' '),
                sensitivity = 20;
    
            viewBox = viewBox.map(num => +num); 
            viewBox[0] += Math.ceil(((e.offsetX - this.svgDrag.lastX)*-1)/sensitivity); //Invert for desired effect
            viewBox[1] += Math.ceil(((e.offsetY - this.svgDrag.lastY)*-1)/sensitivity); //Invert for desired effect
            courseMapSVG.setAttribute('viewBox', viewBox.join(' '));
        }
    }
}