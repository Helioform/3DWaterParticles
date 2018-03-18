 var c;
        var ctx;
        var t=0;
        var w;
        var h;
        var znear=0;
        var zfar=-10000;
        
        function init()
        {
            c=document.querySelector("canvas");
            ctx=c.getContext("2d");
            c.width=window.innerWidth;
            c.height=window.innerHeight;
            w=c.width;
            h=c.height;
            
            initParticles();
        }
                   
        function vertex2(x,y)
        {
            this.x=x;
            this.y=y;
        }
        
        function vertex3(x,y,z)
        {
             this.x=x;
             this.y=y;
             this.z=z;   
             
             this.setXYZ= function(x,y,z)
             {
                this.x=x;
                this.y=y;
                 this.z=z;
             }
        }
            
        function particle(x,y,z,vx,vy,vz,size)
        {
           this.x=x;
           this.y=y; 
           this.z=z;
           this.vx=vx;
           this.vy=vy;
           this.vz=vz;
           this.size=size;
           this.lifetime=0;
           this.maxlife=minmaxRandom(50,100);
           this.alive=true;
           
           this.setPos=function(x,y,z)
           {
               this.x=x;
               this.y=y;
               this.z=z;
           }
           
           this.setVel=function(vx,vy,vz)
           {
               this.vx=vx;
               this.vy=vy;
               this.vz=vz;
           }
           
           this.move = function ()
           {
              this.x+=this.vx;
              this.y+=this.vy;
              this.z+=this.vz; 
           }
           
           this.accelerate = function(dx,dy,dz)
           {
              this.vx+=dx;
              this.vy+=dy;
              this.vz+=dz; 
           }
           
           
        }
        
        var numparts=1250;
        var numverts=4*numparts;
        var prt=[];
        var v=[];
        
        function copyVertices()
        {
            for(i=0;i<numparts;i++)
            {
                
                var s=prt[i].size;
                v[4*i].setXYZ(prt[i].x-s,prt[i].y+s,prt[i].z);
                v[4*i+1].setXYZ(prt[i].x+s,prt[i].y+s,prt[i].z);
                v[4*i+2].setXYZ(prt[i].x+s,prt[i].y-s,prt[i].z);
                v[4*i+3].setXYZ(prt[i].x-s,prt[i].y-s,prt[i].z);
                
            }
        }
        
        function changeNumberOfParticles()
        {
              var numparticles=prompt("Enter number of  particles:");
 
              if(numparticles < 1)
                  alert("Enter a value greater than 0");
              else
              {
                  numparts=numparticles;
                  numverts=4*numparts;
                  initParticles();
              }
        }
          
        function initParticles()
        {
            prt=new Array(numparts);
            
            for(i=0;i<numparts;i++)
            {    
                var vx,vy,vz;
                vx=minmaxRandom(-0.1,0.1);
                vy=minmaxRandom(-0.1,0.1);
                vz=minmaxRandom(-0.1,0.1);
                prt[i]=new particle(0,0,-10,vx,vy,vz,0.1);
            }
            
            v=new Array(numverts);

            for(i=0;i<numparts;i++)
            {
                var x,y,z,s;
                x=prt[i].x;
                y=prt[i].y;
                z=prt[i].z;
                s=prt[i].size;

               v[4*i]=new vertex3(x-s,y+s,z);
                v[4*i+1]=new vertex3(x+s,y+s,z);
                v[4*i+2]=new vertex3(x+s,y-s,z);
                v[4*i+3]=new vertex3(x-s,y-s,z);
            }
            
        }
        
        
        function resetParticles()
        {
            for(i=0;i<numparts;i++)
            {
               delete prt[i];
               prt[i]=new particle(0,0,-10,minmaxRandom(-0.1,0.1),minmaxRandom(-0.1,0.1),0.1); 
            }
            
        }
        
        window.addEventListener('load', function()
        {
            window.alert("Hit the screen to reset the system.")
            init();
            
            setInterval(update, 1000/60);
        });
        
        function rand() { return Math.random(); }
        function minmaxRandom(min,max){return (max-min)*rand()+min;}
        
        function debugoutput(r)
        {
           var m = r.toString();
           ctx.font="20px Georgia";
           ctx.fillStyle="rgba(0,0,255,0.3)";
           ctx.fillText(m,10,100);
        }
            
        
        function project(p,num,d)
        {    
            var vp=new Array(num);
            
            for(i=0;i<vp.length;i++)
            {
                vp[i]=new vertex2(0,0);
            
                vp[i].x = p[i].x *d / p[i].z;
                vp[i].y = -p[i].y *d / p[i].z;// flip because y going down is positive
                
            }
        
            return vp;
        }
        
        function scale(p, num,w,h)
        {
            var vs=new Array(num);
            
            for(i=0;i<vs.length;i++)
            {
               vs[i] = new vertex2(0,0);
               vs[i].x = (p[i].x*w/2.0)+w/2.0;
               vs[i].y = -(p[i].y*h/2.0)+h/2.0;
               
            }
            
            return vs;
        }
        
        function clip(p)
        {
            for(i=0;i<numverts;i++)
            {
                if(p[i].z <= zfar || p[i].z >= znear)
                    return true;
            }
      
            return false;
        }
        
        function update()
        {
           for(i=0;i<numparts;i++)
           {
              if(prt[i].lifetime>prt[i].maxlife)
               {
                   delete prt[i];
                   var vx=minmaxRandom(-0.1,0.1);
                   var vy=minmaxRandom(-0.1,0.1);
                   var vz=minmaxRandom(-0.1,0.1);
                   prt[i]=new particle(0,0,-10,vx,vy,vz,0.1);
               }
                
               prt[i].move();
                 // add gravity                  
               prt[i].accelerate(0,-0.001,0);
               prt[i].lifetime++;
            
                  
           }
            
            copyVertices();
            
            
            draw();
            t+=0.05;
        }
    
        function draw()
        {
            ctx.fillStyle="rgba(0,0,0,0.01)";
            ctx.fillRect(0,0,c.width,c.height);
                            
            // project 3d vertices to screen
             var vp=[];
             
             // clip particles that lie outside viewing frustum
             if(!clip(v))
             {
                 vp=project(v,numverts,1);
            
            // fit to screen
                var vs=[];
                vs=scale(vp,numverts, c.width,c.height);
            
                
                drawParticles(vs);
            }
            
        }
        
                
        function drawParticles(p)
        {
            ctx.fillStyle="rgba(0,0,255,0.09)";
            
            for(j=0;j<numparts;j++)
            {                    
                var dx=p[4*j+1].x-p[4*j].x;
                var dy=p[4*j+2].y-p[4*j].y;
                    
                ctx.fillRect(p[4*j+1].x,p[4*j+1].y,dx,dy);     
            }                       
             
             
        }
        