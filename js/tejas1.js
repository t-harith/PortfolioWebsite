let dim = 2;

const brown_palette = [0x372C2E, 0x563727, 0xFFFFFF, 0x7A431D, 0xDE9E48];
const pinkgray_palette = [0x2C2B30, 0x4F4F51, 0xD6D6D6, 0xF2C4CE, 0xF58F7C];
var palette = pinkgray_palette;
let COLOR_DARK = palette[0];
let COLOR_MILD = palette[1];
let COLOR_LIGHT = palette[2];
let COLOR_BOLD = palette[3];
let COLOR_ACCENT = palette[4];

			var vistas =[];
			var scene = new THREE.Scene()
			scene.background = new THREE.Color( COLOR_DARK );
			//var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
			var aspect = window.innerWidth/window.innerHeight;
			
            var camera = new THREE.OrthographicCamera(1000*(aspect/-2), 1000*(aspect/2), 1000/2, 1000/-2, -2000, 3000);
			camera.position.x = 0;	
            camera.position.y = 0;
            camera.position.z = 1000;
            

			var renderer = new THREE.WebGLRenderer({ antialias: true });
			renderer.setSize(window.innerWidth, window.innerHeight);
			document.body.appendChild( renderer.domElement );
			var state = true;
			var lines = new THREE.LineSegments();
			var intersection_pts = new THREE.Geometry();
			// lines = new THREE.Mesh(intersection_pts, new THREE.MeshBasicMaterial(
			// 	{
			// 		color: COLOR_BOLD,
			// 		side: THREE.DoubleSide
            // 	}));
            
			
			
			var clipPlanes = [ new THREE.Plane(new THREE.Vector3(0, 0, -1), 1000)] ;
            var button = document.getElementById("test_button");
			button.addEventListener('click', function (event) {
				if(state)
				{
					//drawIntersectPts(true);
                    camera.position.copy(planar_p.position);
                    camera.position.add(new THREE.Vector3(350,300,550));
					camera.lookAt(planar_p.position);
					camera.position.y = 200;
					button.innerHTML = "2D";
                    cube.visible = true;
                    planar_p.visible = true;
					planar_p.material.transparent = true;
					grid.visible = true; 
					state = false;
				} else 
				{
					camera.position.x = 0;	
					camera.position.y = 0;
					camera.position.z = 1000;
					//camera.near = 999;
					camera.updateProjectionMatrix();
					camera.lookAt(scene.position);
                    button.innerHTML = "3D";
                    planar_p.visible = false;
					// planar_p.material.transparent = false;
					cube.visible =false;
					grid.visible = false; 
					state = true;	
				}
			}, false);			
			var material = new THREE.MeshBasicMaterial( 
				{
					color: COLOR_MILD, 
					transparent: true,  
					opacity: 0.31
                });
			renderer.localClippingEnabled = true;
			var mat2 = new THREE.MeshBasicMaterial( 
			{
				side: THREE.DoubleSide,
				color: COLOR_ACCENT, 
				
				wireframe: true
				//clippingPlanes: clipPlanes, 
				//clipIntersection: true
            } );
            
            lines = new THREE.Mesh(intersection_pts, mat2);
			lines.position.z += 1;
			lines.geometry.verticesNeedUpdate = true;
			var screen1 = new THREE.Geometry();
			screen1.vertices.push(
				new THREE.Vector3(-1000, 500, 0), 
				new THREE.Vector3(-1000, -500, 0),
				new THREE.Vector3(1000, -500, 0),
				new THREE.Vector3(1000, 500, 0)
			);
			screen1.faces.push(
				new THREE.Face3(0, 1, 3),
				new THREE.Face3(1, 2, 3)
			);
			//var sce1 = new THREE.Mesh(screen1, material);
			//scene.add(sce1);			
			var geometry = new THREE.BoxGeometry(200,200,200);
			var geometry = new THREE.DodecahedronGeometry(200, 3);
			//var geometry = new THREE.Geometry(); 	
			var loader = new THREE.GLTFLoader();
            var cube =  new THREE.Mesh();

			
			//var mesh = new THREE.Mesh();
			loader.load('3d_files/tribot2.glb', ( gltf ) =>
			{
				//gltf.scene.traverse( function (node) { if(node.isMesh) { mesh = node; } });
				mesh = gltf.scene.children[0];
				//console.log(gltf);
				//console.log(mesh);
				// button.innerHTML = "TEST";
				mesh.scale.set(100,100,100);
				//scene.add(mesh);
				//var geod = new THREE.Geometry();
				cube.geometry=new THREE.Geometry().fromBufferGeometry(mesh.geometry);
				cube.material= mat2;
				cube.scale.set(100,100,100);
				//console.log(geometry);
			}, undefined,  (err)=> {console.log(err);});
			//console.log(cube);
			
			//var cub2 = new THREE.Mesh(new THREE.BoxGeometry(400,400, 100), material);
			//scene.add(cub2);
			//cub2.visible = false;
			
            // grid.position.y = -350;
            // grid.rotation.x = Math.PI/2;
			//grid.color = new THREE.Color( 0x000000 );
			const plane_dims = {width: window.innerWidth, height: window.innerHeight};
			var geom_p = new THREE.PlaneGeometry(plane_dims.width, plane_dims.height);
            var planar_p =new THREE.Mesh(geom_p, material); 
            const grid_step_sz = 100;
            var grid = GridHelper(plane_dims.width/100, 50,grid_step_sz, COLOR_MILD);
            grid.position.add(new THREE.Vector3(0,-plane_dims.height/2,0)); 
            // var bleh = Array.prototype.slice.call(grid.geometry.attributes.position.array,3);
            // bleh.push([bleh[bleh.length - 7] + 100, 0, bleh[bleh.length - 5] + 100 ])
            // // grid.geometry.addAttribute('position', new THREE.Float32BufferAttribute( bleh, 3 ));
            scene.add(grid);
			//var geom_p2 = new THREE.PlaneGeometry(400, 400);
			//var planp2 = new THREE.Mesh(geom_p2, mat2);
			scene.add(planar_p);
			//scene.add(planp2);
            planar_p.visible =false;
            grid.visible = false;
            // planar_p.material.transparent = false;
            cube.visible =false;
            camera.updateProjectionMatrix();
			//planar_p.geometry.verticesNeedUpdate = true;
			//var polys =(new ThreeBSP(geom_p2)).intersect(new ThreeBSP(geom_p));
			//var mesh_p =polys.toMesh(new THREE.MeshBasicMaterial({color:0xff0000})); 
			//mesh_p.geometry.verticesNeedUpdate = true;			
			//mesh_p.geometry.elementsNeedUpdate = true;
			//var mesh;	
			//scene.add(mesh_p);
			scene.add(cube);
			console.log(grid)
			//camera.position.z = 2;
			camera.lookAt(scene.position);
			// camera.position.y = 200;
			var scroll_moved =true;
			renderer.render(scene, camera);
			scene.add(lines);
			setTimeout(function()
					{ drawIntersectPts(cube, false);}, 100);
					
					
			window.addEventListener('mousewheel',  function (e)
			{
				//button.innerHTML = document.documentElement.scrollTop.toString();
				var delta = e.wheelDelta;
                planar_p.translateZ(0.01*delta);
                if ( Math.abs(planar_p.position.z) % grid_step_sz < 10) grid.position.z = planar_p.position.z;
                // var pt = new THREE.Vector3(); TODAY
                var z_loc = new THREE.Vector3(0,0,1);
                // let movdir = planar_p.localToWorld(z_loc.copy(planar_p.position)); 
                
                //lines.worldToLocal(pt.copy(z_loc));
                lines.position.z = 10 + (delta/700)*5;
                camera.position = camera.position.add(z_loc.multiplyScalar(0.01*delta));
                //lines.localToWorld(pt.copy(lines.position));
                //pt.copy(lines.position);
                scroll_moved = true;
				//button.innerHTML = z_loc.z + " t " + lines.position.z;
			});
			
			window.addEventListener('resize', function()
			{
				var aspect = window.innerWidth/window.innerHeight;
				camera.left = -1000 * aspect / 2;
				camera.right = 1000 * aspect/2;
				camera.top = 1000/2;
				camera.bottom = -1000/2; 
				camera.updateProjectionMatrix();
				
				renderer.setSize( window.innerWidth, window.innerHeight);
            }, false);
            
            var button_reac = 0;
            var deldy = 100;
            
			function animate()
			{
				
				requestAnimationFrame( animate );
                
                if (button_reac)
                {
                    deldy = 0;
                    button_reac = 0;
                    
                }
                if (deldy < 100)
                {
                    var mv_amt = -Math.sin(deldy/100 * Math.PI);
                    planar_p.translateZ(mv_amt);
                    if ( Math.abs(planar_p.position.z) % grid_step_sz < 10) grid.position.z = planar_p.position.z;
                    // var pt = new THREE.Vector3(); TODAY
                    var z_loc = new THREE.Vector3(0,0,1);
                    // let movdir = planar_p.localToWorld(z_loc.copy(planar_p.position)); 
                    
                    //lines.worldToLocal(pt.copy(z_loc));
                    lines.position.z = 10 + (mv_amt/7)*5;
                    camera.position = camera.position.add(z_loc.multiplyScalar(mv_amt));
                    //lines.localToWorld(pt.copy(lines.position));
                    //pt.copy(lines.position);
                    scroll_moved = true;
                    deldy = deldy + 1;
                }
                        

				if(scroll_moved) 
				{
					drawIntersectPts(cube, false);
					scroll_moved = false;
				}
				// UNCOMMENT NEXT 4 LINES AND 1 ABOVE LINE TO ROTATE
				// drawIntersectPts(cube, false);
				// cube.rotation.x += 0.01; 
				// cube.rotation.y += 0.01;
				// cube.rotation.z += 0.01;	
				// planar_p.visible =false;
				// polys =(new ThreeBSP(sce1)).intersect(new ThreeBSP(cube));
				// // polys = (new ThreeBSP(planp2)).union(new ThreeBSP(planar_p));
				// polys = new ThreeBSP(cube);
				// mesh_p.geometry =polys.toGeometry();
					
				// planar_p.visible = true;
				// scene.add(mesh_p);
				renderer.render(scene, camera);
			}


			function drawIntersectPts(obj, scene_add)
			{
				var mathPlane = new THREE.Plane();
				intersection_pts = new THREE.Geometry();
				var planePointA = new THREE.Vector3();
				var planePointB = new THREE.Vector3(); 
				var planePointC = new THREE.Vector3();
				
				planar_p.localToWorld(planePointA.copy(planar_p.geometry.vertices[planar_p.geometry.faces[0].a]));
				planar_p.localToWorld(planePointB.copy(planar_p.geometry.vertices[planar_p.geometry.faces[0].b]));
				planar_p.localToWorld(planePointC.copy(planar_p.geometry.vertices[planar_p.geometry.faces[0].c])); 
				mathPlane.setFromCoplanarPoints(planePointA, planePointB, planePointC)
			
				planePointA.z += 1;	
				planePointB.z += 1;	
				planePointC.z += 1;	
			
				var a = new THREE.Vector3();
				var b = new THREE.Vector3();
				var c = new THREE.Vector3();

				var linAB = new THREE.Line3();
				var linBC = new THREE.Line3();
				var linCA = new THREE.Line3();

				var poi1 = new THREE.Vector3();
				var poi2 = new THREE.Vector3();
				var poi3 = new THREE.Vector3();

				obj.geometry.faces.forEach(function( face ) 
				{
					obj.localToWorld(a.copy(obj.geometry.vertices[face.a]));
					obj.localToWorld(b.copy(obj.geometry.vertices[face.b]));
					obj.localToWorld(c.copy(obj.geometry.vertices[face.c]));
					linAB = new THREE.Line3(a,b);
					linBC = new THREE.Line3(b,c);
					linCA = new THREE.Line3(c,a);
					if(mathPlane.intersectLine(linAB, poi1))	
					{
						intersection_pts.vertices.push(poi1.clone());			
					}
					if(mathPlane.intersectLine(linBC, poi2))	
					{
						intersection_pts.vertices.push(poi2.clone());			
					}
					if(mathPlane.intersectLine(linCA, poi3))	
					{
						intersection_pts.vertices.push(poi3.clone());			
					}
				});
				gen_faces(intersection_pts);
				lines.geometry = intersection_pts;
				if(scene_add) { scene.add(lines); }
			}

			function gen_faces( geom ) 
			{
				for( var i = 0; i < geom.vertices.length - 2; i++)
				{
					geom.faces.push(new THREE.Face3(0, i+1, i+2));	
				}
            }
            
            setTimeout(function()
					{ animate(); }, 1000);
            
            
            function GridHelper( numx, numy, step, col ) {
                
                var halfSizeX = (numx*step) / 2;
                var halfSizeY = (numy*step) / 2;
                var color = new THREE.Color(col);
                var vertices = [], colors = [];
            
                for ( var i = 0, j = 0, k = - halfSizeY; i <= numy; i ++, k += step ) {
            
                    vertices.push( - halfSizeX, 0, k, halfSizeX, 0, k);
            
            
                    color.toArray( colors, j ); j += 3;
                    color.toArray( colors, j ); j += 3;
                    color.toArray( colors, j ); j += 3;
                    color.toArray( colors, j ); j += 3;
            
                }

                for ( var i = 0, k = - halfSizeX; i <= numx; i ++, k += step ) {
            
                    vertices.push( k, 0, - halfSizeY, k, 0, halfSizeY );

                    color.toArray( colors, j ); j += 3;
                    color.toArray( colors, j ); j += 3;
                    color.toArray( colors, j ); j += 3;
                    color.toArray( colors, j ); j += 3;
            
                }
            
                var geometry = new THREE.BufferGeometry();
                geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
                geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
            
                var material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors } );
            
                return new THREE.LineSegments(geometry, material);
            
            }

           // GridHelper.prototype = Object.assign( Object.create( THREE.LineSegments.prototype ), {

           //     constructor: GridHelper, 
           // 
           //     copy: function ( source ) {
           // 
           //         THREE.LineSegments.prototype.copy.call( this, source );
           // 
           //         this.geometry.copy( source.geometry );
           //         this.material.copy( source.material );
           // 
           //         return this;
           // 
           //     },
           // 
           //     clone: function () {
           // 
           //         return new this.constructor().copy( this );
           // 
           //     }
           // 
           // } );
            
            
            function goop()
            {
                button_reac = 1;
            }

            