<?php
$threeDFiles= glob("./3dmodels/*.gltf");
echo json_encode($threeDFiles);