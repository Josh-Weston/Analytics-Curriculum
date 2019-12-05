export class Home {
    constructor(eventGateway) {
        this.eventGateway = eventGateway;
        this.eventGateway.addListener('homeLoaded', () => this.fetchProfile(true));
    }

    fetchProfile(profileExists) {
        if (profileExists) {
            this.removeSignup();
            //this.gui.welcomeBack();
        } else {
            this.showSignup();
        }
        
    }

    saveProfileChanges() {

    }

    signup() {

    }

    removeSignup() {
        // const signup = document.querySelector('#main-container-signup');
        // document.querySelector('#main-container-illustration').removeChild(signup);
        document.querySelector('#main-container-svg').style.width = "1200px";
        //document.querySelector('#svg-mountain-parent').style.width = "1200px";
    }

    showSignup() {
        const signup = document.querySelector('#main-container-signup');
        signup.style.display = "inline-block";
    }

}