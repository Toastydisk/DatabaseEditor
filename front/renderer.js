
document.addEventListener('DOMContentLoaded', function () {

    const socket = new WebSocket('ws://localhost:8765/');

    const myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
    const raceBonusCheck = document.getElementById("raceBonusCheck");
    const raceBonusAmt = document.getElementById("raceBonusAmt");
    const raceBonusPos = document.getElementById("raceBonusPos");

    const freeDriversPill = document.getElementById("freepill");
    const f2DriversPill = document.getElementById("F2pill");
    const f3DriversPill = document.getElementById("F3pill");

    const freeDriversDiv = document.getElementById("free-drivers");
    const f2DriversDiv = document.getElementById("f2-drivers");
    const f3DriversDiv = document.getElementById("f3-drivers");

    const dropDownMenu = document.getElementById("dropdownMenu");

    const divsArray = [freeDriversDiv, f2DriversDiv, f3DriversDiv]

    let originalParent;
    let destinationParent;
    let draggable;
    let team;
    let posInTeam;

    let team_dict = { 1: "fe", 2: "mc", 3: "rb", 4: "me", 5: "al", 6: "wi", 7: "ha", 8: "at", 9: "af", 10: "as" }
    let inverted_dict = {'ferrari': 1,'mclaren': 2,'redbull': 3,'merc': 4,'alpine': 5,'williams': 6,'haas': 7,'alphatauri': 8,'alfaromeo': 9, 'astonmartin': 10}
    let name_dict = {'ferrari': "Ferrari",'mclaren': "McLaren",'redbull': "Red Bull",'merc': "Mercedes",'alpine': "Alpine",'williams': "Williams",'haas': "Haas",'alphatauri': "Alpha Tauri",'alfaromeo': "Alfa Romeo", 'astonmartin': "Aston Martin"}

    socket.onopen = () => {
        //console.log('Conexión establecida.');
        let data = {
            command: "connect"
        }
        socket.send(JSON.stringify(data))
    };

    socket.onmessage = (event) => {
        // const mensaje = event.data;
        // console.log('Mensaje recibido: ' + event.data);
        let message = JSON.parse(event.data)
        if (message[0] === "saveList") {
            load_saves(message)
        }
        else {
            remove_drivers()
            place_drivers(message)
        }
    };


    function load_saves(savesArray) {
        for (let i = 1; i < savesArray.length; i++) {
            let elem = savesArray[i]
            let li = document.createElement('li');
            let a = document.createElement('a');
            a.classList.add('dropdown-item');
            a.href = '#';
            a.textContent = elem;

            li.appendChild(a);
            dropDownMenu.appendChild(li);
            
        }
        listenersSaves()
    }

    function listenersSaves(){
        document.querySelectorAll('#dropdownMenu a').forEach(item => {
            item.addEventListener("click", function () {
                const dropdownButton = document.getElementById('dropdownButton');
                let saveSelected = item.innerHTML
                dropdownButton.innerHTML = saveSelected;
                let dataSaves = {
                    command: "saveSelected",
                    save: saveSelected
                }
                socket.send(JSON.stringify(dataSaves))
                
            });
        });
    }


    function remove_drivers(){
        
        document.querySelectorAll('.driver-space').forEach(item => {
            item.innerHTML = ""
        });
        freeDriversDiv.innerHTML = ""
        f2DriversDiv.innerHTML = ""
        f3DriversDiv.innerHTML = ""
    }

    function place_drivers(driversArray) {
        let divPosition;
        driversArray.forEach((driver) => {
            divPosition = "free-drivers"
            if (driver[2] > 0 && driver[2] <= 10) divPosition = team_dict[driver[2]] + driver[3];
            else if (driver[2] > 10 && driver[2] <= 20) divPosition = "f2-drivers";
            else if (driver[2] > 20 && driver[2] <= 30) divPosition = "f3-drivers";

            let newDiv = document.createElement("div");
            newDiv.className = "col free-driver";
            newDiv.dataset.driverid = driver[1];
            newDiv.innerHTML = driver[0];
            document.getElementById(divPosition).appendChild(newDiv)



        })
    }

    freeDriversPill.addEventListener("click", function () {
        manageDrivers("show", "hide", "hide")
    })

    f2DriversPill.addEventListener("click", function () {
        manageDrivers("hide", "show", "hide")
    })

    f3DriversPill.addEventListener("click", function () {
        manageDrivers("hide", "hide", "show")
    })

    function manageDrivers(...divs) {
        divsArray.forEach(function (div, index) {
            if (divs[index] === "show") {
                div.className = "main-columns-drag-section"
            }
            else {
                div.className = "main-columns-drag-section d-none"
            }
        })
    }

    raceBonusCheck.addEventListener("click", function () {
        if (raceBonusCheck.checked) {
            raceBonusPos.disabled = false;
            raceBonusAmt.disabled = false;
            raceBonusAmt.value = "";
            raceBonusPos.value = "";
        }
        else {
            raceBonusPos.disabled = true;
            raceBonusAmt.disabled = true;
            raceBonusAmt.value = "0";
            raceBonusPos.value = "10";
        }
    })

    document.getElementById("confirmButton").addEventListener('click', function () {
        let salaryData = document.getElementById("salaryInput").value;
        let yearData = document.getElementById("yearInput").value;
        let signBonusData = document.getElementById("signBonusInput").value;
        let raceBonusData;
        let raceBonusPosData;
        
        if(raceBonusAmt.value === "")
         raceBonusData = "0";
        else

         raceBonusData = raceBonusAmt.value;
        if(raceBonusPos.value === "")
            raceBonusPosData = "10";
        else
            raceBonusPosData = raceBonusPos.value;

        if (originalParent.id === "f2-drivers" | originalParent.id === "f3-drivers" | originalParent.className === "col driver-space") {
            let extra = {
                command: "fire",
                driver: draggable.dataset.driverid
            }
            socket.send(JSON.stringify(extra))
        }
        let data = {
            command: "hire",
            driver: draggable.dataset.driverid,
            teamID: inverted_dict[team],
            position: posInTeam,
            salary: salaryData,
            signBonus: signBonusData,
            raceBonus: raceBonusData,
            raceBonusPos: raceBonusPosData,
            year: yearData
        }
        destinationParent.appendChild(draggable);
        socket.send(JSON.stringify(data))
    })

    document.getElementById("cancelButton").addEventListener('click', function () {
        originalParent.appendChild(draggable);

        div0.style.transform = 'translate(0px, 0px)';
        div0.setAttribute('data-x', 0);
        div0.setAttribute('data-y', 0);


    })

    interact('.free-driver').draggable({
        inertia: true,
        listeners: {
            start(event) {
                originalParent = event.target.parentNode;
                draggable = event.target;
                let target = event.target;
                let position = target.getBoundingClientRect();
                let width = target.getBoundingClientRect().width
                target.style.width = width + "px";
                target.style.position = "fixed";
                target.style.top = position.top + "px";
            },
            move(event) {
                const target = event.target;
                const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                target.style.transform = `translate(${x}px, ${y}px)`;
                target.style.opacity = 1;
                target.style.zIndex = 10;

                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            },
            end(event) {
                let target = event.target;
                target.style.position = "relative";
                target.style.top = "auto";
                target.style.width = "auto";
                const freeDrivers = document.getElementById('free-drivers');
                const freeRect = freeDrivers.getBoundingClientRect();

                const driverSpaceElements = document.querySelectorAll('.driver-space');
                driverSpaceElements.forEach(function (element) {
                    const rect = element.getBoundingClientRect();
                    if (event.clientX >= rect.left && event.clientX <= rect.right &&
                        event.clientY >= rect.top && event.clientY <= rect.bottom) {
                        if (element.childElementCount < 1) {
                            destinationParent = element;
                            element.appendChild(target);
                            team = element.parentNode.dataset.team
                            posInTeam = element.id.charAt(2)
                            document.getElementById("contractModalTitle").innerHTML = target.innerHTML + "'s contract with " + name_dict[team];
                            myModal.show();
                        }
                    }
                });


                const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                if (event.clientX >= freeRect.left && event.clientX <= freeRect.right &&
                    event.clientY >= freeRect.top && event.clientY <= freeRect.bottom) {
                    originalParent.removeChild(draggable);
                    freeDrivers.appendChild(target);

                    let data = {
                        command: "fire",
                        driver: draggable.dataset.driverid
                    }
                    socket.send(JSON.stringify(data))
                }

                target.style.transform = 'none';
                target.setAttribute('data-x', 0);
                target.setAttribute('data-y', 0);
                // originalParent = undefined;
                // destinationParent = undefined;
                // draggable = undefined;
            }
        }
    });
});