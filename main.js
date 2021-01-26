import * as THREE from '/threejswebapp/node_modules/three/build/three.module.js';
import { OrbitControls } from '/threejswebapp/node_modules/three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '/threejswebapp/node_modules/three/examples/jsm/loaders/GLTFLoader.js';

"use strict"

//define global variables
const raycaster = new THREE.Raycaster();
const mouseVector = new THREE.Vector3();
let renderer, camera, controls, scene, fileLists, selectedObject, lastColor;

// start of scripts - AJAX read 3d files in 3dmodels folder
(function load3dFilesList() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            fileLists = JSON.parse(this.responseText);
            scene = init();
        }
    };
    xhttp.open("get", "get3dFiles.php", true);
    xhttp.send();
})();

//inite function
function init() {
    //camera's config
    {
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.x = 5;
        camera.position.y = 5;
        camera.position.z = 60;
        camera.lookAt(new THREE.Vector3(-30, -30, 0));
    }

    //scene config
    scene = new THREE.Scene();

    //renderer's config
    {
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
    }

    //lights config
    {
        const directionalLight = getDirectionalLight(0xcccccc, 2, -40, 20, 0);
        scene.add(directionalLight);
        const directionalLight2 = getDirectionalLight(0xcccccc, 2, 0, 20, -40);
        scene.add(directionalLight2);
        const directionalLight3 = getDirectionalLight(0xcccccc, 2, -50, 20, 0)
        scene.add(directionalLight3);
        const directionalLight4 = getDirectionalLight(0xababab, 2, 0, 20, 30)
        scene.add(directionalLight4);
    }

    //sample box
    {
        // const box = getBox(1, 1, 1);
        // box.position.y = box.geometry.parameters.height / 2;
        // scene.add(box);
    }

    //gltf loader config
    {
        const kyln = new THREE.Group();
        kyln.name = 'kyln';
        const loader = new GLTFLoader();
        fileLists.forEach(file => {

            loader.load(file, function (gltf) {
                const root = gltf.scene;
                root.name = file;
                root.position.x += -30;
                root.position.y += -30;
                root.rotation.x = -Math.PI / 2;
                kyln.add(root);

            }, undefined, function (error) {

                console.error(error);

            });
        });
        scene.add(kyln);
    }

    //orbit control
    controls = new OrbitControls(camera, renderer.domElement);

    //update
    update(renderer, scene, camera);
    return scene;
}

function getBox(w, h, d) {
    const geometry = new THREE.BoxGeometry(w, h, d);
    const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00
    });
    const mesh = new THREE.Mesh(
        geometry,
        material
    );

    return mesh;
}
function getPlane(size) {
    const geometry = new THREE.PlaneGeometry(size, size);
    const material = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(
        geometry,
        material
    );

    return mesh;
}
function getDirectionalLight(color, intensity, x, y, z) {
    const directionalLight = new THREE.DirectionalLight(color, intensity);
    directionalLight.position.x = x;
    directionalLight.position.y = y;
    directionalLight.position.z = z;
    return directionalLight;
}

function update(renderer, scene, camera) {
    renderer.render(scene, camera);
    // const kyln = scene.getObjectByName('kyln');
    // kyln.rotation.y += 0.01;
    requestAnimationFrame(() => {
        update(renderer, scene, camera)
    })
}
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function getIntersects(x, y) {

    x = (x / window.innerWidth) * 2 - 1;
    y = - (y / window.innerHeight) * 2 + 1;

    mouseVector.set(x, y, 0.5);
    raycaster.setFromCamera(mouseVector, camera);

    return raycaster.intersectObject(scene, true);

}
function raycasting(event) {

    event.preventDefault();

    if (selectedObject) {
        selectedObject.material.color.setHex(lastColor);
        selectedObject = null;
    }

    const intersects = getIntersects(event.layerX, event.layerY);

    if (intersects.length > 0) {

        const res = intersects.filter(function (res) {

            return res && res.object;

        })[0];

        if (res && res.object) {

            selectedObject = res.object;
            lastColor = selectedObject.material.color.getHex();
            selectedObject.material.color.set('#f00');

            // selectedObject.parent.visible = false;
            let fileName = selectedObject.parent.name.split('/')[2].split('.gltf')[0];
            console.log(fileName);

            // get3dItemInfo('BLOWER-HOUSE_1');
            get3dItemInfo(fileName);
        }

    }

}

function get3dItemInfo(selectedItem) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText)
        }
    };
    // const url = `database.php?Item=${selectedItem}`;
    const url = `database.php?Item=${selectedItem}`;
    xhttp.open("get", url, true);
    xhttp.send();
};

//define event listeners
window.addEventListener('click', raycasting, false);
window.addEventListener('resize', onWindowResize, false);




