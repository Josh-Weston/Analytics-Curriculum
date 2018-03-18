export class Schedule {
    constructor(eventGateway) {
        this.eventGateway = eventGateway;
        this.eventGateway.addListener('registrationDetails', (e) => this.expandMoreDetail(e));
    }

    expandMoreDetail(e) {
        let parent = e.path.find(el => Array.from(el.classList).find(inner => inner === 'registration-card'));
        parent.querySelector('.registration-detail-container').classList.toggle('registration-detail-container--open');
        parent.querySelector('.registration-arrow').classList.toggle('registration-arrow--up');
        
    }
}