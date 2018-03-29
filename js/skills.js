export class Skills {
    constructor(eventGateway) {
        
        this.eventGateway = eventGateway;
        this.eventGateway.addListener('changeSkill', data => this.viewSkill(data));
    }

    viewSkill(selectedSkill) {
        let skillsContainer = document.querySelector('#skills-main-container');
        let url = `/skills_pages/${selectedSkill}.html`;
        fetch(url)
            .then(response => response.text())
            .then(parsed => skillsContainer.innerHTML = parsed);
    }

}