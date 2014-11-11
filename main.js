(function () { "use strict";
var $hxClasses = {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var BlockType = $hxClasses["BlockType"] = { __ename__ : true, __constructs__ : ["wall","start","checkpoint","checkpointFlying","checkpointShadow","finish","character","void","end"] };
BlockType.wall = ["wall",0];
BlockType.wall.toString = $estr;
BlockType.wall.__enum__ = BlockType;
BlockType.start = ["start",1];
BlockType.start.toString = $estr;
BlockType.start.__enum__ = BlockType;
BlockType.checkpoint = ["checkpoint",2];
BlockType.checkpoint.toString = $estr;
BlockType.checkpoint.__enum__ = BlockType;
BlockType.checkpointFlying = ["checkpointFlying",3];
BlockType.checkpointFlying.toString = $estr;
BlockType.checkpointFlying.__enum__ = BlockType;
BlockType.checkpointShadow = ["checkpointShadow",4];
BlockType.checkpointShadow.toString = $estr;
BlockType.checkpointShadow.__enum__ = BlockType;
BlockType.finish = ["finish",5];
BlockType.finish.toString = $estr;
BlockType.finish.__enum__ = BlockType;
BlockType.character = ["character",6];
BlockType.character.toString = $estr;
BlockType.character.__enum__ = BlockType;
BlockType["void"] = ["void",7];
BlockType["void"].toString = $estr;
BlockType["void"].__enum__ = BlockType;
BlockType.end = ["end",8];
BlockType.end.toString = $estr;
BlockType.end.__enum__ = BlockType;
BlockType.__empty_constructs__ = [BlockType.wall,BlockType.start,BlockType.checkpoint,BlockType.checkpointFlying,BlockType.checkpointShadow,BlockType.finish,BlockType.character,BlockType.void,BlockType.end];
var h3d = {};
h3d.scene = {};
h3d.scene.Object = function(parent) {
	this.visible = true;
	this.absPos = new h3d.Matrix();
	this.absPos.identity();
	this.x = 0;
	this.posChanged = true;
	0;
	this.y = 0;
	this.posChanged = true;
	0;
	this.z = 0;
	this.posChanged = true;
	0;
	this.scaleX = 1;
	this.posChanged = true;
	1;
	this.scaleY = 1;
	this.posChanged = true;
	1;
	this.scaleZ = 1;
	this.posChanged = true;
	1;
	this.qRot = new h3d.Quat();
	this.posChanged = false;
	this.childs = [];
	if(parent != null) parent.addChild(this);
};
$hxClasses["h3d.scene.Object"] = h3d.scene.Object;
h3d.scene.Object.__name__ = true;
h3d.scene.Object.prototype = {
	getInvPos: function() {
		if(this.invPos == null) {
			this.invPos = new h3d.Matrix();
			this.invPos._44 = 0;
		}
		if(this.invPos._44 == 0) this.invPos.inverse3x4(this.absPos);
		return this.invPos;
	}
	,addChild: function(o) {
		this.addChildAt(o,this.childs.length);
	}
	,addChildAt: function(o,pos) {
		if(pos < 0) pos = 0;
		if(pos > this.childs.length) pos = this.childs.length;
		var p = this;
		while(p != null) {
			if(p == o) throw "Recursive addChild";
			p = p.parent;
		}
		if(o.parent != null) o.parent.removeChild(o);
		this.childs.splice(pos,0,o);
		o.parent = this;
		o.lastFrame = -1;
		o.posChanged = true;
	}
	,removeChild: function(o) {
		if(HxOverrides.remove(this.childs,o)) o.parent = null;
	}
	,draw: function(ctx) {
	}
	,calcAbsPos: function() {
		this.qRot.saveToMatrix(this.absPos);
		this.absPos._11 *= this.scaleX;
		this.absPos._12 *= this.scaleX;
		this.absPos._13 *= this.scaleX;
		this.absPos._21 *= this.scaleY;
		this.absPos._22 *= this.scaleY;
		this.absPos._23 *= this.scaleY;
		this.absPos._31 *= this.scaleZ;
		this.absPos._32 *= this.scaleZ;
		this.absPos._33 *= this.scaleZ;
		this.absPos._41 = this.x;
		this.absPos._42 = this.y;
		this.absPos._43 = this.z;
		if(this.follow != null) {
			this.follow.syncPos();
			this.absPos.multiply3x4(this.absPos,this.follow.absPos);
			this.posChanged = true;
		} else if(this.parent != null) this.absPos.multiply3x4(this.absPos,this.parent.absPos);
		if(this.defaultTransform != null) this.absPos.multiply3x4(this.defaultTransform,this.absPos);
		if(this.invPos != null) this.invPos._44 = 0;
	}
	,sync: function(ctx) {
		if(this.currentAnimation != null) {
			var old = this.parent;
			var dt = ctx.elapsedTime;
			while(dt > 0 && this.currentAnimation != null) dt = this.currentAnimation.update(dt);
			if(this.currentAnimation != null) this.currentAnimation.sync();
			if(this.parent == null && old != null) return;
		}
		var changed = this.posChanged;
		if(changed) {
			this.posChanged = false;
			this.calcAbsPos();
		}
		this.lastFrame = ctx.frame;
		var p = 0;
		var len = this.childs.length;
		while(p < len) {
			var c = this.childs[p];
			if(c == null) break;
			if(c.lastFrame != ctx.frame) {
				if(changed) c.posChanged = true;
				c.sync(ctx);
			}
			if(this.childs[p] != c) {
				p = 0;
				len = this.childs.length;
			} else p++;
		}
	}
	,syncPos: function() {
		if(this.parent != null) this.parent.syncPos();
		if(this.posChanged) {
			this.posChanged = false;
			this.calcAbsPos();
			var _g = 0;
			var _g1 = this.childs;
			while(_g < _g1.length) {
				var c = _g1[_g];
				++_g;
				c.posChanged = true;
			}
		}
	}
	,emit: function(ctx) {
	}
	,emitRec: function(ctx) {
		if(!this.visible) return;
		if(this.posChanged) {
			if(this.currentAnimation != null) this.currentAnimation.sync();
			this.posChanged = false;
			this.calcAbsPos();
			var _g = 0;
			var _g1 = this.childs;
			while(_g < _g1.length) {
				var c = _g1[_g];
				++_g;
				c.posChanged = true;
			}
		}
		this.emit(ctx);
		var _g2 = 0;
		var _g11 = this.childs;
		while(_g2 < _g11.length) {
			var c1 = _g11[_g2];
			++_g2;
			c1.emitRec(ctx);
		}
	}
	,set_x: function(v) {
		this.x = v;
		this.posChanged = true;
		return v;
	}
	,set_y: function(v) {
		this.y = v;
		this.posChanged = true;
		return v;
	}
	,set_z: function(v) {
		this.z = v;
		this.posChanged = true;
		return v;
	}
	,set_scaleX: function(v) {
		this.scaleX = v;
		this.posChanged = true;
		return v;
	}
	,set_scaleY: function(v) {
		this.scaleY = v;
		this.posChanged = true;
		return v;
	}
	,set_scaleZ: function(v) {
		this.scaleZ = v;
		this.posChanged = true;
		return v;
	}
	,rotate: function(rx,ry,rz) {
		var qTmp = new h3d.Quat();
		qTmp.initRotate(rx,ry,rz);
		this.qRot.multiply(qTmp,this.qRot);
		this.posChanged = true;
	}
	,setRotateAxis: function(ax,ay,az,angle) {
		this.qRot.initRotateAxis(ax,ay,az,angle);
		this.posChanged = true;
	}
	,scale: function(v) {
		var _g = this;
		_g.set_scaleX(_g.scaleX * v);
		var _g1 = this;
		_g1.set_scaleY(_g1.scaleY * v);
		var _g2 = this;
		_g2.set_scaleZ(_g2.scaleZ * v);
		this.posChanged = true;
	}
	,__class__: h3d.scene.Object
	,__properties__: {set_scaleZ:"set_scaleZ",set_scaleY:"set_scaleY",set_scaleX:"set_scaleX",set_z:"set_z",set_y:"set_y",set_x:"set_x"}
};
var Character = function(parent,id) {
	this.jumpStatus = 2;
	this.alive = true;
	this.rotatingSpeed = Math.PI / 2;
	this.jumpCooldown = 0.33;
	this.jumpClock = 0.0;
	this.speed = 5;
	h3d.scene.Object.call(this,parent);
	this.id = id;
	var object = new h3d.prim.FBXModel(Data.shardMesh);
	this.mat = new h3d.mat.MeshMaterial(Data.shardTexture);
	this.mat.set_blendMode(1);
	this.obj = new h3d.scene.Mesh(object,this.mat,this);
	this.scale(0.33);
	this.obj.rotate(Math.PI / 2,0.0,Math.PI);
	var _g = this.obj;
	_g.set_x(_g.x + 1.0);
	var _g1 = this.obj;
	_g1.set_y(_g1.y + 2.0);
	motion.Actuate.tween(this.obj,0.5,{ y : this.obj.y + 0.25}).ease(motion.easing.Linear.get_easeNone()).repeat().reflect();
	this.glow = new Plane(this,Data.glowTexture,true);
	this.glow.scale(5);
	var _g2 = this.glow;
	_g2.set_x(_g2.x - 1.75);
	var _g3 = this.glow;
	_g3.set_y(_g3.y - 0.5);
	this.setAlpha(0.75);
	var bodyDef = new box2D.dynamics.B2BodyDef();
	bodyDef.type = box2D.dynamics.B2Body.b2_dynamicBody;
	var bodyBox = new box2D.collision.shapes.B2PolygonShape();
	bodyBox.setAsBox(0.45,0.45);
	var fixtureDef = new box2D.dynamics.B2FixtureDef();
	fixtureDef.shape = bodyBox;
	fixtureDef.density = 1.0;
	this.body = Main.world.createBody(bodyDef);
	this.body.setFixedRotation(true);
	this.body.createFixture(fixtureDef);
	this.body.setUserData({ entity : this, type : BlockType.character, grounded : false});
	var massData = new box2D.collision.shapes.B2MassData();
	massData.mass = 1.0;
	this.body.setMassData(massData);
	this.body.setLinearDamping(10.0);
};
$hxClasses["Character"] = Character;
Character.__name__ = true;
Character.__super__ = h3d.scene.Object;
Character.prototype = $extend(h3d.scene.Object.prototype,{
	update: function(dt) {
		if(this.alive) {
			if(this.jumpStatus == 0 && this.body.getLinearVelocity().y == 0.0) this.jumpStatus = 2;
			this.obj.rotate(0.0,(this.id == 1?-1.0:1.0) * this.rotatingSpeed * dt,0.0);
			this.set_x(this.body.getPosition().x);
			this.set_y(this.body.getPosition().y);
			this.jumpClock += dt;
			if(hxd.Key.isDown(38) && this.jumpStatus == 2 && this.jumpClock >= this.jumpCooldown) {
				this.body.applyImpulse(new box2D.common.math.B2Vec2(0,75),this.body.getWorldCenter());
				this.jumpClock = 0.0;
				this.body.getUserData().grounded = false;
				this.jumpStatus = 0;
			}
			var dx = 0.0;
			if(hxd.Key.isDown(37)) dx -= 1.0;
			if(hxd.Key.isDown(39)) dx += 1.0;
			if(dx != 0.0) this.body.applyImpulse(new box2D.common.math.B2Vec2(dx * this.speed,0.0),this.body.getWorldCenter());
		}
	}
	,accelerate: function() {
		this.rotatingSpeed *= 1.33;
	}
	,setAlpha: function(alpha) {
		this.mat.mshader.color__.w = alpha;
		if(this.glow.material.mshader.color__.w > alpha) this.glow.material.mshader.color__.w = alpha;
	}
	,__class__: Character
});
var Checkpoint = function(parent,shadow) {
	h3d.scene.Object.call(this,parent);
	this.shadow = shadow;
	var tex = hxd.Res.loader.loadImage("stars.png").toTexture();
	this.material = new h3d.mat.MeshMaterial(tex);
	var mesh = new h3d.scene.Mesh(Data.cube,this.material,this);
	this.material.set_blendMode(1);
	if(shadow) this.material.mshader.color__.w = 0.5;
	if(!shadow) {
		var bodyDef = new box2D.dynamics.B2BodyDef();
		var bodyBox = new box2D.collision.shapes.B2PolygonShape();
		bodyBox.setAsBox(0.5,0.5);
		var fixtureDef = new box2D.dynamics.B2FixtureDef();
		fixtureDef.shape = bodyBox;
		fixtureDef.density = 1.0;
		fixtureDef.isSensor = true;
		this.body = Main.world.createBody(bodyDef);
		this.body.createFixture(fixtureDef);
		this.body.setUserData({ entity : this, type : shadow?BlockType.checkpointShadow:BlockType.checkpoint, grounded : false});
		this.body.setFixedRotation(true);
	}
};
$hxClasses["Checkpoint"] = Checkpoint;
Checkpoint.__name__ = true;
Checkpoint.__super__ = h3d.scene.Object;
Checkpoint.prototype = $extend(h3d.scene.Object.prototype,{
	setPosition: function(x,y) {
		this.x = x;
		this.posChanged = true;
		x;
		this.y = y;
		this.posChanged = true;
		y;
		if(!this.shadow) this.body.setPosition(new box2D.common.math.B2Vec2(x,y));
	}
	,__class__: Checkpoint
});
var box2D = {};
box2D.dynamics = {};
box2D.dynamics.B2ContactListener = function() {
};
$hxClasses["box2D.dynamics.B2ContactListener"] = box2D.dynamics.B2ContactListener;
box2D.dynamics.B2ContactListener.__name__ = true;
box2D.dynamics.B2ContactListener.prototype = {
	beginContact: function(contact) {
	}
	,endContact: function(contact) {
	}
	,preSolve: function(contact,oldManifold) {
	}
	,postSolve: function(contact,impulse) {
	}
	,__class__: box2D.dynamics.B2ContactListener
};
var ContactListener = function() {
	box2D.dynamics.B2ContactListener.call(this);
};
$hxClasses["ContactListener"] = ContactListener;
ContactListener.__name__ = true;
ContactListener.__super__ = box2D.dynamics.B2ContactListener;
ContactListener.prototype = $extend(box2D.dynamics.B2ContactListener.prototype,{
	beginContact: function(contact) {
		box2D.dynamics.B2ContactListener.prototype.beginContact.call(this,contact);
		var dataA = contact.getFixtureA().getBody().getUserData();
		var dataB = contact.getFixtureB().getBody().getUserData();
		if(dataA.type == BlockType.wall && dataB.type == BlockType.character) dataB.grounded = true;
		if(dataB.type == BlockType.wall && dataA.type == BlockType.character) dataA.grounded = true;
		if(dataA.type == BlockType.character && dataB.type == BlockType.checkpoint) Main.game.validateCheckpoint();
		if(dataA.type == BlockType.checkpoint && dataB.type == BlockType.character) Main.game.validateCheckpoint();
		if(dataA.type == BlockType.character && dataB.type == BlockType["void"]) Main.game.destroyCharacter();
		if(dataA.type == BlockType["void"] && dataB.type == BlockType.character) Main.game.destroyCharacter();
		if(dataA.type == BlockType.character && dataB.type == BlockType.end) Main.game.win();
		if(dataA.type == BlockType.end && dataB.type == BlockType.character) Main.game.win();
	}
	,endContact: function(contact) {
		box2D.dynamics.B2ContactListener.prototype.endContact.call(this,contact);
		var dataA = contact.getFixtureA().getBody().getUserData();
		var dataB = contact.getFixtureB().getBody().getUserData();
		if(dataA.type == BlockType.wall && dataB.type == BlockType.character) dataB.grounded = false;
		if(dataB.type == BlockType.wall && dataA.type == BlockType.character) dataA.grounded = false;
	}
	,__class__: ContactListener
});
var Data = function() { };
$hxClasses["Data"] = Data;
Data.__name__ = true;
Data.init = function() {
	Data.jungleBlockMesh = hxd.Res.loader.loadFbxModel("jungle3.fbx").toFbx().getGeometry();
	Data.jungleBlockTexture = hxd.Res.loader.loadImage("jungle.png").toTexture();
	Data.shardFbx = hxd.Res.loader.loadFbxModel("shard2.fbx").toFbx();
	Data.shardMesh = Data.shardFbx.getGeometry();
	Data.shardTexture = hxd.Res.loader.loadImage("shardTexture.png").toTexture();
	Data.treesMesh = hxd.Res.loader.loadFbxModel("trees.FBX").toFbx().getGeometry();
	Data.treesTexture = hxd.Res.loader.loadImage("treesTexture.png").toTexture();
	Data.jungle2Mesh = hxd.Res.loader.loadFbxModel("jungle2.FBX").toFbx().getGeometry();
	Data.jungle2Texture = hxd.Res.loader.loadImage("jungle2Texture.png").toTexture();
	Data.glowTexture = hxd.Res.loader.loadImage("glow.png").toTexture();
	Data.skyplane = hxd.Res.loader.loadImage("skyplane.png").toTexture();
	Data.cube = new h3d.prim.Cube();
	Data.cube.addUVs();
	Data.cube.addNormals();
	Data.bgm = new window.Howl({ urls : ["music/bgm.mp3","music/bgm.ogg"]});
	Data.bgm.loop(true);
	Data.win = new window.Howl({ urls : ["music/win.mp3","music/win.ogg"]});
	Data.lose = new window.Howl({ urls : ["music/lose.mp3","music/lose.ogg"]});
};
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
$hxClasses["EReg"] = EReg;
EReg.__name__ = true;
EReg.prototype = {
	replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,__class__: EReg
};
var End = function(parent) {
	h3d.scene.Object.call(this,parent);
	var tex = hxd.Res.loader.loadImage("end.png").toTexture();
	var mat = new h3d.mat.MeshMaterial(tex);
	mat.set_blendMode(3);
	mat.mshader.color__.w = 0.5;
	var obj1 = new h3d.scene.Mesh(Data.cube,mat,this);
	var bodyDef = new box2D.dynamics.B2BodyDef();
	var bodyBox = new box2D.collision.shapes.B2PolygonShape();
	bodyBox.setAsBox(0.51,0.51);
	var fixtureDef = new box2D.dynamics.B2FixtureDef();
	fixtureDef.shape = bodyBox;
	fixtureDef.isSensor = true;
	this.body = Main.world.createBody(bodyDef);
	this.body.createFixture(fixtureDef);
	this.body.setUserData({ entity : this, type : BlockType.end, grounded : false});
	this.body.setFixedRotation(true);
};
$hxClasses["End"] = End;
End.__name__ = true;
End.__super__ = h3d.scene.Object;
End.prototype = $extend(h3d.scene.Object.prototype,{
	setPosition: function(x,y) {
		this.x = x;
		this.posChanged = true;
		x;
		this.y = y;
		this.posChanged = true;
		y;
		this.body.setPosition(new box2D.common.math.B2Vec2(x,y));
	}
	,__class__: End
});
var HxOverrides = function() { };
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = true;
HxOverrides.strDate = function(s) {
	var _g = s.length;
	switch(_g) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k1 = s.split("-");
		return new Date(k1[0],k1[1] - 1,k1[2],0,0,0);
	case 19:
		var k2 = s.split(" ");
		var y = k2[0].split("-");
		var t = k2[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
};
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Lambda = function() { };
$hxClasses["Lambda"] = Lambda;
Lambda.__name__ = true;
Lambda.indexOf = function(it,v) {
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var v2 = $it0.next();
		if(v == v2) return i;
		i++;
	}
	return -1;
};
var List = function() {
	this.length = 0;
};
$hxClasses["List"] = List;
List.__name__ = true;
List.prototype = {
	add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,__class__: List
};
var hxd = {};
hxd.App = function(engine) {
	if(engine != null) {
		this.engine = engine;
		haxe.Timer.delay($bind(this,this.setup),0);
	} else {
		this.engine = engine = new h3d.Engine();
		engine.onReady = $bind(this,this.setup);
		engine.init();
	}
};
$hxClasses["hxd.App"] = hxd.App;
hxd.App.__name__ = true;
hxd.App.prototype = {
	onResize: function() {
	}
	,setup: function() {
		this.engine.onResized = $bind(this,this.onResize);
		this.s3d = new h3d.scene.Scene();
		this.s2d = new h2d.Scene();
		this.s3d.addPass(this.s2d);
		this.init();
		hxd.Timer.skip();
		this.mainLoop();
		hxd.System.setLoop($bind(this,this.mainLoop));
		hxd.Key.initialize();
	}
	,init: function() {
	}
	,mainLoop: function() {
		hxd.Timer.update();
		this.s2d.checkEvents();
		this.update(hxd.Timer.tmod);
		this.s2d.setElapsedTime(hxd.Timer.tmod / 60);
		this.s3d.setElapsedTime(hxd.Timer.tmod / 60);
		this.engine.render(this.s3d);
	}
	,update: function(dt) {
	}
	,__class__: hxd.App
};
box2D.common = {};
box2D.common.math = {};
box2D.common.math.B2Vec2 = function(x_,y_) {
	if(y_ == null) y_ = 0;
	if(x_ == null) x_ = 0;
	this.x = x_;
	this.y = y_;
};
$hxClasses["box2D.common.math.B2Vec2"] = box2D.common.math.B2Vec2;
box2D.common.math.B2Vec2.__name__ = true;
box2D.common.math.B2Vec2.make = function(x_,y_) {
	return new box2D.common.math.B2Vec2(x_,y_);
};
box2D.common.math.B2Vec2.prototype = {
	setZero: function() {
		this.x = 0.0;
		this.y = 0.0;
	}
	,set: function(x_,y_) {
		if(y_ == null) y_ = 0;
		if(x_ == null) x_ = 0;
		this.x = x_;
		this.y = y_;
	}
	,setV: function(v) {
		this.x = v.x;
		this.y = v.y;
	}
	,getNegative: function() {
		return new box2D.common.math.B2Vec2(-this.x,-this.y);
	}
	,negativeSelf: function() {
		this.x = -this.x;
		this.y = -this.y;
	}
	,copy: function() {
		return new box2D.common.math.B2Vec2(this.x,this.y);
	}
	,multiply: function(a) {
		this.x *= a;
		this.y *= a;
	}
	,length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	,lengthSquared: function() {
		return this.x * this.x + this.y * this.y;
	}
	,normalize: function() {
		var length = Math.sqrt(this.x * this.x + this.y * this.y);
		if(length < Number.MIN_VALUE) return 0.0;
		var invLength = 1.0 / length;
		this.x *= invLength;
		this.y *= invLength;
		return length;
	}
	,__class__: box2D.common.math.B2Vec2
};
box2D.common.math.B2Sweep = function() {
	this.localCenter = new box2D.common.math.B2Vec2();
	this.c0 = new box2D.common.math.B2Vec2();
	this.c = new box2D.common.math.B2Vec2();
};
$hxClasses["box2D.common.math.B2Sweep"] = box2D.common.math.B2Sweep;
box2D.common.math.B2Sweep.__name__ = true;
box2D.common.math.B2Sweep.prototype = {
	set: function(other) {
		this.localCenter.setV(other.localCenter);
		this.c0.setV(other.c0);
		this.c.setV(other.c);
		this.a0 = other.a0;
		this.a = other.a;
		this.t0 = other.t0;
	}
	,getTransform: function(xf,alpha) {
		xf.position.x = (1.0 - alpha) * this.c0.x + alpha * this.c.x;
		xf.position.y = (1.0 - alpha) * this.c0.y + alpha * this.c.y;
		var angle = (1.0 - alpha) * this.a0 + alpha * this.a;
		xf.R.set(angle);
		var tMat = xf.R;
		xf.position.x -= tMat.col1.x * this.localCenter.x + tMat.col2.x * this.localCenter.y;
		xf.position.y -= tMat.col1.y * this.localCenter.x + tMat.col2.y * this.localCenter.y;
	}
	,advance: function(t) {
		if(this.t0 < t && 1.0 - this.t0 > Number.MIN_VALUE) {
			var alpha = (t - this.t0) / (1.0 - this.t0);
			this.c0.x = (1.0 - alpha) * this.c0.x + alpha * this.c.x;
			this.c0.y = (1.0 - alpha) * this.c0.y + alpha * this.c.y;
			this.a0 = (1.0 - alpha) * this.a0 + alpha * this.a;
			this.t0 = t;
		}
	}
	,__class__: box2D.common.math.B2Sweep
};
var Std = function() { };
$hxClasses["Std"] = Std;
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.parseFloat = function(x) {
	return parseFloat(x);
};
box2D.common.math.B2Mat22 = function() {
	this.col1 = new box2D.common.math.B2Vec2(0,1.0);
	this.col2 = new box2D.common.math.B2Vec2(0,1.0);
};
$hxClasses["box2D.common.math.B2Mat22"] = box2D.common.math.B2Mat22;
box2D.common.math.B2Mat22.__name__ = true;
box2D.common.math.B2Mat22.prototype = {
	set: function(angle) {
		var c = Math.cos(angle);
		var s = Math.sin(angle);
		this.col1.x = c;
		this.col2.x = -s;
		this.col1.y = s;
		this.col2.y = c;
	}
	,setM: function(m) {
		this.col1.setV(m.col1);
		this.col2.setV(m.col2);
	}
	,getInverse: function(out) {
		var a = this.col1.x;
		var b = this.col2.x;
		var c = this.col1.y;
		var d = this.col2.y;
		var det = a * d - b * c;
		if(det != 0.0) det = 1.0 / det;
		out.col1.x = det * d;
		out.col2.x = -det * b;
		out.col1.y = -det * c;
		out.col2.y = det * a;
		return out;
	}
	,__class__: box2D.common.math.B2Mat22
};
box2D.common.math.B2Transform = function(pos,r) {
	this.position = new box2D.common.math.B2Vec2();
	this.R = new box2D.common.math.B2Mat22();
	if(pos != null) {
		this.position.setV(pos);
		this.R.setM(r);
	}
};
$hxClasses["box2D.common.math.B2Transform"] = box2D.common.math.B2Transform;
box2D.common.math.B2Transform.__name__ = true;
box2D.common.math.B2Transform.prototype = {
	__class__: box2D.common.math.B2Transform
};
box2D.common.math.B2Math = function() { };
$hxClasses["box2D.common.math.B2Math"] = box2D.common.math.B2Math;
box2D.common.math.B2Math.__name__ = true;
box2D.common.math.B2Math.dot = function(a,b) {
	return a.x * b.x + a.y * b.y;
};
box2D.common.math.B2Math.crossVV = function(a,b) {
	return a.x * b.y - a.y * b.x;
};
box2D.common.math.B2Math.crossVF = function(a,s) {
	var v = new box2D.common.math.B2Vec2(s * a.y,-s * a.x);
	return v;
};
box2D.common.math.B2Math.crossFV = function(s,a) {
	var v = new box2D.common.math.B2Vec2(-s * a.y,s * a.x);
	return v;
};
box2D.common.math.B2Math.mulMV = function(A,v) {
	var u = new box2D.common.math.B2Vec2(A.col1.x * v.x + A.col2.x * v.y,A.col1.y * v.x + A.col2.y * v.y);
	return u;
};
box2D.common.math.B2Math.mulTMV = function(A,v) {
	var u = new box2D.common.math.B2Vec2(box2D.common.math.B2Math.dot(v,A.col1),box2D.common.math.B2Math.dot(v,A.col2));
	return u;
};
box2D.common.math.B2Math.mulX = function(T,v) {
	var a = box2D.common.math.B2Math.mulMV(T.R,v);
	a.x += T.position.x;
	a.y += T.position.y;
	return a;
};
box2D.common.math.B2Math.subtractVV = function(a,b) {
	var v = new box2D.common.math.B2Vec2(a.x - b.x,a.y - b.y);
	return v;
};
box2D.common.math.B2Math.abs = function(a) {
	if(a > 0.0) return a; else return -a;
};
box2D.common.math.B2Math.min = function(a,b) {
	if(a < b) return a; else return b;
};
box2D.common.math.B2Math.max = function(a,b) {
	if(a > b) return a; else return b;
};
box2D.common.math.B2Math.clamp = function(a,low,high) {
	if(a < low) return low; else if(a > high) return high; else return a;
};
box2D.dynamics.B2TimeStep = function() {
};
$hxClasses["box2D.dynamics.B2TimeStep"] = box2D.dynamics.B2TimeStep;
box2D.dynamics.B2TimeStep.__name__ = true;
box2D.dynamics.B2TimeStep.prototype = {
	set: function(step) {
		this.dt = step.dt;
		this.inv_dt = step.inv_dt;
		this.positionIterations = step.positionIterations;
		this.velocityIterations = step.velocityIterations;
		this.warmStarting = step.warmStarting;
	}
	,__class__: box2D.dynamics.B2TimeStep
};
box2D.dynamics.B2World = function(gravity,doSleep) {
	this.s_stack = new Array();
	this.m_contactManager = new box2D.dynamics.B2ContactManager();
	this.m_contactSolver = new box2D.dynamics.contacts.B2ContactSolver();
	this.m_island = new box2D.dynamics.B2Island();
	this.m_destructionListener = null;
	this.m_debugDraw = null;
	this.m_bodyList = null;
	this.m_contactList = null;
	this.m_jointList = null;
	this.m_controllerList = null;
	this.m_bodyCount = 0;
	this.m_contactCount = 0;
	this.m_jointCount = 0;
	this.m_controllerCount = 0;
	box2D.dynamics.B2World.m_warmStarting = true;
	box2D.dynamics.B2World.m_continuousPhysics = true;
	this.m_allowSleep = doSleep;
	this.m_gravity = gravity;
	this.m_inv_dt0 = 0.0;
	this.m_contactManager.m_world = this;
	var bd = new box2D.dynamics.B2BodyDef();
	this.m_groundBody = this.createBody(bd);
};
$hxClasses["box2D.dynamics.B2World"] = box2D.dynamics.B2World;
box2D.dynamics.B2World.__name__ = true;
box2D.dynamics.B2World.prototype = {
	setContactListener: function(listener) {
		this.m_contactManager.m_contactListener = listener;
	}
	,createBody: function(def) {
		if(this.isLocked() == true) return null;
		var b = new box2D.dynamics.B2Body(def,this);
		b.m_prev = null;
		b.m_next = this.m_bodyList;
		if(this.m_bodyList != null) this.m_bodyList.m_prev = b;
		this.m_bodyList = b;
		++this.m_bodyCount;
		return b;
	}
	,step: function(dt,velocityIterations,positionIterations) {
		if((this.m_flags & box2D.dynamics.B2World.e_newFixture) != 0) {
			this.m_contactManager.findNewContacts();
			this.m_flags &= ~box2D.dynamics.B2World.e_newFixture;
		}
		this.m_flags |= box2D.dynamics.B2World.e_locked;
		var step = box2D.dynamics.B2World.s_timestep2;
		step.dt = dt;
		step.velocityIterations = velocityIterations;
		step.positionIterations = positionIterations;
		if(dt > 0.0) step.inv_dt = 1.0 / dt; else step.inv_dt = 0.0;
		step.dtRatio = this.m_inv_dt0 * dt;
		step.warmStarting = box2D.dynamics.B2World.m_warmStarting;
		this.m_contactManager.collide();
		if(step.dt > 0.0) this.solve(step);
		if(box2D.dynamics.B2World.m_continuousPhysics && step.dt > 0.0) this.solveTOI(step);
		if(step.dt > 0.0) this.m_inv_dt0 = step.inv_dt;
		this.m_flags &= ~box2D.dynamics.B2World.e_locked;
	}
	,isLocked: function() {
		return (this.m_flags & box2D.dynamics.B2World.e_locked) > 0;
	}
	,solve: function(step) {
		var b;
		var controller = this.m_controllerList;
		while(controller != null) {
			controller.step(step);
			controller = controller.m_next;
		}
		var island = this.m_island;
		island.initialize(this.m_bodyCount,this.m_contactCount,this.m_jointCount,null,this.m_contactManager.m_contactListener,this.m_contactSolver);
		b = this.m_bodyList;
		while(b != null) {
			b.m_flags &= ~box2D.dynamics.B2Body.e_islandFlag;
			b = b.m_next;
		}
		var c = this.m_contactList;
		while(c != null) {
			c.m_flags &= ~box2D.dynamics.contacts.B2Contact.e_islandFlag;
			c = c.m_next;
		}
		var j = this.m_jointList;
		while(j != null) {
			j.m_islandFlag = false;
			j = j.m_next;
		}
		var stackSize = this.m_bodyCount;
		var stack = this.s_stack;
		var seed = this.m_bodyList;
		while(seed != null) {
			if((seed.m_flags & box2D.dynamics.B2Body.e_islandFlag) != 0) {
				seed = seed.m_next;
				continue;
			}
			if(seed.isAwake() == false || seed.isActive() == false) {
				seed = seed.m_next;
				continue;
			}
			if(seed.getType() == box2D.dynamics.B2Body.b2_staticBody) {
				seed = seed.m_next;
				continue;
			}
			island.clear();
			var stackCount = 0;
			stack[stackCount++] = seed;
			seed.m_flags |= box2D.dynamics.B2Body.e_islandFlag;
			while(stackCount > 0) {
				b = stack[--stackCount];
				island.addBody(b);
				if(b.isAwake() == false) b.setAwake(true);
				if(b.getType() == box2D.dynamics.B2Body.b2_staticBody) continue;
				var other;
				var ce = b.m_contactList;
				while(ce != null) {
					if((ce.contact.m_flags & box2D.dynamics.contacts.B2Contact.e_islandFlag) != 0) {
						ce = ce.next;
						continue;
					}
					if(ce.contact.isSensor() == true || ce.contact.isEnabled() == false || ce.contact.isTouching() == false) {
						ce = ce.next;
						continue;
					}
					island.addContact(ce.contact);
					ce.contact.m_flags |= box2D.dynamics.contacts.B2Contact.e_islandFlag;
					other = ce.other;
					if((other.m_flags & box2D.dynamics.B2Body.e_islandFlag) != 0) {
						ce = ce.next;
						continue;
					}
					stack[stackCount++] = other;
					other.m_flags |= box2D.dynamics.B2Body.e_islandFlag;
					ce = ce.next;
				}
				var jn = b.m_jointList;
				while(jn != null) {
					if(jn.joint.m_islandFlag == true) {
						jn = jn.next;
						continue;
					}
					other = jn.other;
					if(other.isActive() == false) {
						jn = jn.next;
						continue;
					}
					island.addJoint(jn.joint);
					jn.joint.m_islandFlag = true;
					if((other.m_flags & box2D.dynamics.B2Body.e_islandFlag) != 0) {
						jn = jn.next;
						continue;
					}
					stack[stackCount++] = other;
					other.m_flags |= box2D.dynamics.B2Body.e_islandFlag;
					jn = jn.next;
				}
			}
			island.solve(step,this.m_gravity,this.m_allowSleep);
			var _g1 = 0;
			var _g = island.m_bodyCount;
			while(_g1 < _g) {
				var i = _g1++;
				b = island.m_bodies[i];
				if(b.getType() == box2D.dynamics.B2Body.b2_staticBody) b.m_flags &= ~box2D.dynamics.B2Body.e_islandFlag;
			}
			seed = seed.m_next;
		}
		var _g11 = 0;
		var _g2 = stack.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			if(stack[i1] == null) break;
			stack[i1] = null;
		}
		b = this.m_bodyList;
		while(b != null) {
			if(b.isAwake() == false || b.isActive() == false) {
				b = b.m_next;
				continue;
			}
			if(b.getType() == box2D.dynamics.B2Body.b2_staticBody) {
				b = b.m_next;
				continue;
			}
			b.synchronizeFixtures();
			b = b.m_next;
		}
		this.m_contactManager.findNewContacts();
	}
	,solveTOI: function(step) {
		var b;
		var fA;
		var fB;
		var bA;
		var bB;
		var cEdge;
		var j;
		var island = this.m_island;
		island.initialize(this.m_bodyCount,box2D.common.B2Settings.b2_maxTOIContactsPerIsland,box2D.common.B2Settings.b2_maxTOIJointsPerIsland,null,this.m_contactManager.m_contactListener,this.m_contactSolver);
		var queue = box2D.dynamics.B2World.s_queue;
		b = this.m_bodyList;
		while(b != null) {
			b.m_flags &= ~box2D.dynamics.B2Body.e_islandFlag;
			b.m_sweep.t0 = 0.0;
			b = b.m_next;
		}
		var c = this.m_contactList;
		while(c != null) {
			c.m_flags &= ~(box2D.dynamics.contacts.B2Contact.e_toiFlag | box2D.dynamics.contacts.B2Contact.e_islandFlag);
			c = c.m_next;
		}
		j = this.m_jointList;
		while(j != null) {
			j.m_islandFlag = false;
			j = j.m_next;
		}
		while(true) {
			var minContact = null;
			var minTOI = 1.0;
			c = this.m_contactList;
			while(c != null) {
				if(c.isSensor() == true || c.isEnabled() == false || c.isContinuous() == false) {
					c = c.m_next;
					continue;
				}
				var toi = 1.0;
				if((c.m_flags & box2D.dynamics.contacts.B2Contact.e_toiFlag) != 0) toi = c.m_toi; else {
					fA = c.m_fixtureA;
					fB = c.m_fixtureB;
					bA = fA.m_body;
					bB = fB.m_body;
					if((bA.getType() != box2D.dynamics.B2Body.b2_dynamicBody || bA.isAwake() == false) && (bB.getType() != box2D.dynamics.B2Body.b2_dynamicBody || bB.isAwake() == false)) {
						c = c.m_next;
						continue;
					}
					var t0 = bA.m_sweep.t0;
					if(bA.m_sweep.t0 < bB.m_sweep.t0) {
						t0 = bB.m_sweep.t0;
						bA.m_sweep.advance(t0);
					} else if(bB.m_sweep.t0 < bA.m_sweep.t0) {
						t0 = bA.m_sweep.t0;
						bB.m_sweep.advance(t0);
					}
					toi = c.computeTOI(bA.m_sweep,bB.m_sweep);
					box2D.common.B2Settings.b2Assert(0.0 <= toi && toi <= 1.0);
					if(toi > 0.0 && toi < 1.0) {
						toi = (1.0 - toi) * t0 + toi;
						if(toi > 1) toi = 1;
					}
					c.m_toi = toi;
					c.m_flags |= box2D.dynamics.contacts.B2Contact.e_toiFlag;
				}
				if(Number.MIN_VALUE < toi && toi < minTOI) {
					minContact = c;
					minTOI = toi;
				}
				c = c.m_next;
			}
			if(minContact == null || 1.0 - 100.0 * Number.MIN_VALUE < minTOI) break;
			fA = minContact.m_fixtureA;
			fB = minContact.m_fixtureB;
			bA = fA.m_body;
			bB = fB.m_body;
			box2D.dynamics.B2World.s_backupA.set(bA.m_sweep);
			box2D.dynamics.B2World.s_backupB.set(bB.m_sweep);
			bA.advance(minTOI);
			bB.advance(minTOI);
			minContact.update(this.m_contactManager.m_contactListener);
			minContact.m_flags &= ~box2D.dynamics.contacts.B2Contact.e_toiFlag;
			if(minContact.isSensor() == true || minContact.isEnabled() == false) {
				bA.m_sweep.set(box2D.dynamics.B2World.s_backupA);
				bB.m_sweep.set(box2D.dynamics.B2World.s_backupB);
				bA.synchronizeTransform();
				bB.synchronizeTransform();
				continue;
			}
			if(minContact.isTouching() == false) continue;
			var seed = bA;
			if(seed.getType() != box2D.dynamics.B2Body.b2_dynamicBody) seed = bB;
			island.clear();
			var queueStart = 0;
			var queueSize = 0;
			queue[queueStart + queueSize++] = seed;
			seed.m_flags |= box2D.dynamics.B2Body.e_islandFlag;
			while(queueSize > 0) {
				b = queue[queueStart++];
				--queueSize;
				island.addBody(b);
				if(b.isAwake() == false) b.setAwake(true);
				if(b.getType() != box2D.dynamics.B2Body.b2_dynamicBody) continue;
				cEdge = b.m_contactList;
				var other;
				while(cEdge != null) {
					if(island.m_contactCount == island.m_contactCapacity) {
						cEdge = cEdge.next;
						break;
					}
					if((cEdge.contact.m_flags & box2D.dynamics.contacts.B2Contact.e_islandFlag) != 0) {
						cEdge = cEdge.next;
						continue;
					}
					if(cEdge.contact.isSensor() == true || cEdge.contact.isEnabled() == false || cEdge.contact.isTouching() == false) {
						cEdge = cEdge.next;
						continue;
					}
					island.addContact(cEdge.contact);
					cEdge.contact.m_flags |= box2D.dynamics.contacts.B2Contact.e_islandFlag;
					other = cEdge.other;
					if((other.m_flags & box2D.dynamics.B2Body.e_islandFlag) != 0) {
						cEdge = cEdge.next;
						continue;
					}
					if(other.getType() != box2D.dynamics.B2Body.b2_staticBody) {
						other.advance(minTOI);
						other.setAwake(true);
					}
					queue[queueStart + queueSize] = other;
					++queueSize;
					other.m_flags |= box2D.dynamics.B2Body.e_islandFlag;
					cEdge = cEdge.next;
				}
				var jEdge = b.m_jointList;
				while(jEdge != null) {
					if(island.m_jointCount == island.m_jointCapacity) {
						jEdge = jEdge.next;
						continue;
					}
					if(jEdge.joint.m_islandFlag == true) {
						jEdge = jEdge.next;
						continue;
					}
					other = jEdge.other;
					if(other.isActive() == false) {
						jEdge = jEdge.next;
						continue;
					}
					island.addJoint(jEdge.joint);
					jEdge.joint.m_islandFlag = true;
					if((other.m_flags & box2D.dynamics.B2Body.e_islandFlag) != 0) {
						jEdge = jEdge.next;
						continue;
					}
					if(other.getType() != box2D.dynamics.B2Body.b2_staticBody) {
						other.advance(minTOI);
						other.setAwake(true);
					}
					queue[queueStart + queueSize] = other;
					++queueSize;
					other.m_flags |= box2D.dynamics.B2Body.e_islandFlag;
					jEdge = jEdge.next;
				}
			}
			var subStep = box2D.dynamics.B2World.s_timestep;
			subStep.warmStarting = false;
			subStep.dt = (1.0 - minTOI) * step.dt;
			subStep.inv_dt = 1.0 / subStep.dt;
			subStep.dtRatio = 0.0;
			subStep.velocityIterations = step.velocityIterations;
			subStep.positionIterations = step.positionIterations;
			island.solveTOI(subStep);
			var i;
			var _g1 = 0;
			var _g = island.m_bodyCount;
			while(_g1 < _g) {
				var i1 = _g1++;
				b = island.m_bodies[i1];
				b.m_flags &= ~box2D.dynamics.B2Body.e_islandFlag;
				if(b.isAwake() == false) continue;
				if(b.getType() != box2D.dynamics.B2Body.b2_dynamicBody) continue;
				b.synchronizeFixtures();
				cEdge = b.m_contactList;
				while(cEdge != null) {
					cEdge.contact.m_flags &= ~box2D.dynamics.contacts.B2Contact.e_toiFlag;
					cEdge = cEdge.next;
				}
			}
			var _g11 = 0;
			var _g2 = island.m_contactCount;
			while(_g11 < _g2) {
				var i2 = _g11++;
				c = island.m_contacts[i2];
				c.m_flags &= ~(box2D.dynamics.contacts.B2Contact.e_toiFlag | box2D.dynamics.contacts.B2Contact.e_islandFlag);
			}
			var _g12 = 0;
			var _g3 = island.m_jointCount;
			while(_g12 < _g3) {
				var i3 = _g12++;
				j = island.m_joints[i3];
				j.m_islandFlag = false;
			}
			this.m_contactManager.findNewContacts();
		}
	}
	,__class__: box2D.dynamics.B2World
};
box2D.collision = {};
box2D.collision.B2ContactID = function() {
	this.features = new box2D.collision.Features();
	this.features._m_id = this;
};
$hxClasses["box2D.collision.B2ContactID"] = box2D.collision.B2ContactID;
box2D.collision.B2ContactID.__name__ = true;
box2D.collision.B2ContactID.prototype = {
	set: function(id) {
		this.set_key(id._key);
	}
	,get_key: function() {
		return this._key;
	}
	,set_key: function(value) {
		this._key = value;
		this.features._referenceEdge = this._key & 255;
		this.features._incidentEdge = (this._key & 65280) >> 8 & 255;
		this.features._incidentVertex = (this._key & 16711680) >> 16 & 255;
		this.features._flip = (this._key & -16777216) >> 24 & 255;
		return this._key;
	}
	,__class__: box2D.collision.B2ContactID
	,__properties__: {set_key:"set_key",get_key:"get_key"}
};
box2D.collision.Features = function() {
};
$hxClasses["box2D.collision.Features"] = box2D.collision.Features;
box2D.collision.Features.__name__ = true;
box2D.collision.Features.prototype = {
	set_referenceEdge: function(value) {
		this._referenceEdge = value;
		this._m_id._key = this._m_id._key & -256 | this._referenceEdge & 255;
		return value;
	}
	,set_incidentEdge: function(value) {
		this._incidentEdge = value;
		this._m_id._key = this._m_id._key & -65281 | this._incidentEdge << 8 & 65280;
		return value;
	}
	,set_incidentVertex: function(value) {
		this._incidentVertex = value;
		this._m_id._key = this._m_id._key & -16711681 | this._incidentVertex << 16 & 16711680;
		return value;
	}
	,set_flip: function(value) {
		this._flip = value;
		this._m_id._key = this._m_id._key & 16777215 | this._flip << 24 & -16777216;
		return value;
	}
	,__class__: box2D.collision.Features
	,__properties__: {set_flip:"set_flip",set_incidentVertex:"set_incidentVertex",set_incidentEdge:"set_incidentEdge",set_referenceEdge:"set_referenceEdge"}
};
box2D.dynamics.B2ContactManager = function() {
	this.m_world = null;
	this.m_contactCount = 0;
	this.m_contactFilter = box2D.dynamics.B2ContactFilter.b2_defaultFilter;
	this.m_contactListener = box2D.dynamics.B2ContactListener.b2_defaultListener;
	this.m_contactFactory = new box2D.dynamics.contacts.B2ContactFactory(this.m_allocator);
	this.m_broadPhase = new box2D.collision.B2DynamicTreeBroadPhase();
};
$hxClasses["box2D.dynamics.B2ContactManager"] = box2D.dynamics.B2ContactManager;
box2D.dynamics.B2ContactManager.__name__ = true;
box2D.dynamics.B2ContactManager.prototype = {
	addPair: function(proxyUserDataA,proxyUserDataB) {
		var fixtureA;
		fixtureA = js.Boot.__cast(proxyUserDataA , box2D.dynamics.B2Fixture);
		var fixtureB;
		fixtureB = js.Boot.__cast(proxyUserDataB , box2D.dynamics.B2Fixture);
		var bodyA = fixtureA.getBody();
		var bodyB = fixtureB.getBody();
		if(bodyA == bodyB) return;
		var edge = bodyB.getContactList();
		while(edge != null) {
			if(edge.other == bodyA) {
				var fA = edge.contact.getFixtureA();
				var fB = edge.contact.getFixtureB();
				if(fA == fixtureA && fB == fixtureB) return;
				if(fA == fixtureB && fB == fixtureA) return;
			}
			edge = edge.next;
		}
		if(bodyB.shouldCollide(bodyA) == false) return;
		if(this.m_contactFilter.shouldCollide(fixtureA,fixtureB) == false) return;
		var c = this.m_contactFactory.create(fixtureA,fixtureB);
		fixtureA = c.getFixtureA();
		fixtureB = c.getFixtureB();
		bodyA = fixtureA.m_body;
		bodyB = fixtureB.m_body;
		c.m_prev = null;
		c.m_next = this.m_world.m_contactList;
		if(this.m_world.m_contactList != null) this.m_world.m_contactList.m_prev = c;
		this.m_world.m_contactList = c;
		c.m_nodeA.contact = c;
		c.m_nodeA.other = bodyB;
		c.m_nodeA.prev = null;
		c.m_nodeA.next = bodyA.m_contactList;
		if(bodyA.m_contactList != null) bodyA.m_contactList.prev = c.m_nodeA;
		bodyA.m_contactList = c.m_nodeA;
		c.m_nodeB.contact = c;
		c.m_nodeB.other = bodyA;
		c.m_nodeB.prev = null;
		c.m_nodeB.next = bodyB.m_contactList;
		if(bodyB.m_contactList != null) bodyB.m_contactList.prev = c.m_nodeB;
		bodyB.m_contactList = c.m_nodeB;
		++this.m_world.m_contactCount;
		return;
	}
	,findNewContacts: function() {
		this.m_broadPhase.updatePairs($bind(this,this.addPair));
	}
	,destroy: function(c) {
		var fixtureA = c.getFixtureA();
		var fixtureB = c.getFixtureB();
		var bodyA = fixtureA.getBody();
		var bodyB = fixtureB.getBody();
		if(c.isTouching()) this.m_contactListener.endContact(c);
		if(c.m_prev != null) c.m_prev.m_next = c.m_next;
		if(c.m_next != null) c.m_next.m_prev = c.m_prev;
		if(c == this.m_world.m_contactList) this.m_world.m_contactList = c.m_next;
		if(c.m_nodeA.prev != null) c.m_nodeA.prev.next = c.m_nodeA.next;
		if(c.m_nodeA.next != null) c.m_nodeA.next.prev = c.m_nodeA.prev;
		if(c.m_nodeA == bodyA.m_contactList) bodyA.m_contactList = c.m_nodeA.next;
		if(c.m_nodeB.prev != null) c.m_nodeB.prev.next = c.m_nodeB.next;
		if(c.m_nodeB.next != null) c.m_nodeB.next.prev = c.m_nodeB.prev;
		if(c.m_nodeB == bodyB.m_contactList) bodyB.m_contactList = c.m_nodeB.next;
		this.m_contactFactory.destroy(c);
		--this.m_contactCount;
	}
	,collide: function() {
		var c = this.m_world.m_contactList;
		while(c != null) {
			var fixtureA = c.getFixtureA();
			var fixtureB = c.getFixtureB();
			var bodyA = fixtureA.getBody();
			var bodyB = fixtureB.getBody();
			if(bodyA.isAwake() == false && bodyB.isAwake() == false) {
				c = c.getNext();
				continue;
			}
			if((c.m_flags & box2D.dynamics.contacts.B2Contact.e_filterFlag) != 0) {
				if(bodyB.shouldCollide(bodyA) == false) {
					var cNuke = c;
					c = cNuke.getNext();
					this.destroy(cNuke);
					continue;
				}
				if(this.m_contactFilter.shouldCollide(fixtureA,fixtureB) == false) {
					var cNuke1 = c;
					c = cNuke1.getNext();
					this.destroy(cNuke1);
					continue;
				}
				c.m_flags &= ~box2D.dynamics.contacts.B2Contact.e_filterFlag;
			}
			var proxyA = fixtureA.m_proxy;
			var proxyB = fixtureB.m_proxy;
			var overlap = this.m_broadPhase.testOverlap(proxyA,proxyB);
			if(overlap == false) {
				var cNuke2 = c;
				c = cNuke2.getNext();
				this.destroy(cNuke2);
				continue;
			}
			c.update(this.m_contactListener);
			c = c.getNext();
		}
	}
	,__class__: box2D.dynamics.B2ContactManager
};
box2D.dynamics.B2ContactFilter = function() {
};
$hxClasses["box2D.dynamics.B2ContactFilter"] = box2D.dynamics.B2ContactFilter;
box2D.dynamics.B2ContactFilter.__name__ = true;
box2D.dynamics.B2ContactFilter.prototype = {
	shouldCollide: function(fixtureA,fixtureB) {
		var filter1 = fixtureA.getFilterData();
		var filter2 = fixtureB.getFilterData();
		if(filter1.groupIndex == filter2.groupIndex && filter1.groupIndex != 0) return filter1.groupIndex > 0;
		var collide = (filter1.maskBits & filter2.categoryBits) != 0 && (filter1.categoryBits & filter2.maskBits) != 0;
		return collide;
	}
	,__class__: box2D.dynamics.B2ContactFilter
};
box2D.dynamics.contacts = {};
box2D.dynamics.contacts.B2ContactFactory = function(allocator) {
	this.m_allocator = allocator;
	this.initializeRegisters();
};
$hxClasses["box2D.dynamics.contacts.B2ContactFactory"] = box2D.dynamics.contacts.B2ContactFactory;
box2D.dynamics.contacts.B2ContactFactory.__name__ = true;
box2D.dynamics.contacts.B2ContactFactory.prototype = {
	addType: function(createFcn,destroyFcn,type1,type2) {
		var index1 = type1[1];
		var index2 = type2[1];
		this.m_registers[index1][index2].createFcn = createFcn;
		this.m_registers[index1][index2].destroyFcn = destroyFcn;
		this.m_registers[index1][index2].primary = true;
		if(type1 != type2) {
			this.m_registers[index2][index1].createFcn = createFcn;
			this.m_registers[index2][index1].destroyFcn = destroyFcn;
			this.m_registers[index2][index1].primary = false;
		}
	}
	,initializeRegisters: function() {
		this.m_registers = new Array();
		var _g1 = 0;
		var _g = Type.allEnums(box2D.collision.shapes.B2ShapeType).length;
		while(_g1 < _g) {
			var i = _g1++;
			this.m_registers[i] = new Array();
			var _g3 = 0;
			var _g2 = Type.allEnums(box2D.collision.shapes.B2ShapeType).length;
			while(_g3 < _g2) {
				var j = _g3++;
				this.m_registers[i][j] = new box2D.dynamics.contacts.B2ContactRegister();
			}
		}
		this.addType(box2D.dynamics.contacts.B2CircleContact.create,box2D.dynamics.contacts.B2CircleContact.destroy,box2D.collision.shapes.B2ShapeType.CIRCLE_SHAPE,box2D.collision.shapes.B2ShapeType.CIRCLE_SHAPE);
		this.addType(box2D.dynamics.contacts.B2PolyAndCircleContact.create,box2D.dynamics.contacts.B2PolyAndCircleContact.destroy,box2D.collision.shapes.B2ShapeType.POLYGON_SHAPE,box2D.collision.shapes.B2ShapeType.CIRCLE_SHAPE);
		this.addType(box2D.dynamics.contacts.B2PolygonContact.create,box2D.dynamics.contacts.B2PolygonContact.destroy,box2D.collision.shapes.B2ShapeType.POLYGON_SHAPE,box2D.collision.shapes.B2ShapeType.POLYGON_SHAPE);
		this.addType(box2D.dynamics.contacts.B2EdgeAndCircleContact.create,box2D.dynamics.contacts.B2EdgeAndCircleContact.destroy,box2D.collision.shapes.B2ShapeType.EDGE_SHAPE,box2D.collision.shapes.B2ShapeType.CIRCLE_SHAPE);
		this.addType(box2D.dynamics.contacts.B2PolyAndEdgeContact.create,box2D.dynamics.contacts.B2PolyAndEdgeContact.destroy,box2D.collision.shapes.B2ShapeType.POLYGON_SHAPE,box2D.collision.shapes.B2ShapeType.EDGE_SHAPE);
	}
	,create: function(fixtureA,fixtureB) {
		var type1 = fixtureA.getType();
		var type2 = fixtureB.getType();
		var reg = this.m_registers[type1[1]][type2[1]];
		var c;
		if(reg.pool != null) {
			c = reg.pool;
			reg.pool = c.m_next;
			reg.poolCount--;
			c.reset(fixtureA,fixtureB);
			return c;
		}
		var createFcn = reg.createFcn;
		if(createFcn != null) {
			if(reg.primary) {
				c = createFcn(this.m_allocator);
				c.reset(fixtureA,fixtureB);
				return c;
			} else {
				c = createFcn(this.m_allocator);
				c.reset(fixtureB,fixtureA);
				return c;
			}
		} else return null;
	}
	,destroy: function(contact) {
		if(contact.m_manifold.m_pointCount > 0) {
			contact.m_fixtureA.m_body.setAwake(true);
			contact.m_fixtureB.m_body.setAwake(true);
		}
		var type1 = contact.m_fixtureA.getType();
		var type2 = contact.m_fixtureB.getType();
		var reg = this.m_registers[type1[1]][type2[1]];
		reg.poolCount++;
		contact.m_next = reg.pool;
		reg.pool = contact;
		var destroyFcn = reg.destroyFcn;
		destroyFcn(contact,this.m_allocator);
	}
	,__class__: box2D.dynamics.contacts.B2ContactFactory
};
box2D.collision.IBroadPhase = function() { };
$hxClasses["box2D.collision.IBroadPhase"] = box2D.collision.IBroadPhase;
box2D.collision.IBroadPhase.__name__ = true;
box2D.collision.IBroadPhase.prototype = {
	__class__: box2D.collision.IBroadPhase
};
box2D.collision.B2DynamicTreeBroadPhase = function() {
	this.m_tree = new box2D.collision.B2DynamicTree();
	this.m_moveBuffer = new Array();
	this.m_pairBuffer = new Array();
	this.m_pairCount = 0;
};
$hxClasses["box2D.collision.B2DynamicTreeBroadPhase"] = box2D.collision.B2DynamicTreeBroadPhase;
box2D.collision.B2DynamicTreeBroadPhase.__name__ = true;
box2D.collision.B2DynamicTreeBroadPhase.__interfaces__ = [box2D.collision.IBroadPhase];
box2D.collision.B2DynamicTreeBroadPhase.prototype = {
	createProxy: function(aabb,userData) {
		var proxy = this.m_tree.createProxy(aabb,userData);
		++this.m_proxyCount;
		this.bufferMove(proxy);
		return proxy;
	}
	,moveProxy: function(proxy,aabb,displacement) {
		var buffer = this.m_tree.moveProxy(proxy,aabb,displacement);
		if(buffer) this.bufferMove(proxy);
	}
	,testOverlap: function(proxyA,proxyB) {
		var aabbA = this.m_tree.getFatAABB(proxyA);
		var aabbB = this.m_tree.getFatAABB(proxyB);
		return aabbA.testOverlap(aabbB);
	}
	,updatePairs: function(callbackMethod) {
		var _g2 = this;
		this.m_pairCount = 0;
		var _g = 0;
		var _g1 = this.m_moveBuffer;
		while(_g < _g1.length) {
			var queryProxy = [_g1[_g]];
			++_g;
			var queryCallback = (function(queryProxy) {
				return function(proxy) {
					if(proxy == queryProxy[0]) return true;
					if(_g2.m_pairCount == _g2.m_pairBuffer.length) _g2.m_pairBuffer[_g2.m_pairCount] = new box2D.collision.B2DynamicTreePair();
					var pair = _g2.m_pairBuffer[_g2.m_pairCount];
					if(proxy.id < queryProxy[0].id) {
						pair.proxyA = proxy;
						pair.proxyB = queryProxy[0];
					} else {
						pair.proxyA = queryProxy[0];
						pair.proxyB = proxy;
					}
					++_g2.m_pairCount;
					return true;
				};
			})(queryProxy);
			var fatAABB = this.m_tree.getFatAABB(queryProxy[0]);
			this.m_tree.query(queryCallback,fatAABB);
		}
		this.m_moveBuffer = new Array();
		var pairing = true;
		var i = 0;
		while(pairing) if(i >= this.m_pairCount) pairing = false; else {
			var primaryPair = this.m_pairBuffer[i];
			var userDataA = this.m_tree.getUserData(primaryPair.proxyA);
			var userDataB = this.m_tree.getUserData(primaryPair.proxyB);
			callbackMethod(userDataA,userDataB);
			++i;
			while(i < this.m_pairCount) {
				var pair1 = this.m_pairBuffer[i];
				if(pair1.proxyA != primaryPair.proxyA || pair1.proxyB != primaryPair.proxyB) break;
				++i;
			}
		}
	}
	,bufferMove: function(proxy) {
		this.m_moveBuffer[this.m_moveBuffer.length] = proxy;
	}
	,__class__: box2D.collision.B2DynamicTreeBroadPhase
};
box2D.collision.B2DynamicTree = function() {
	this.m_root = null;
	this.m_freeList = null;
	this.m_path = 0;
	this.m_insertionCount = 0;
};
$hxClasses["box2D.collision.B2DynamicTree"] = box2D.collision.B2DynamicTree;
box2D.collision.B2DynamicTree.__name__ = true;
box2D.collision.B2DynamicTree.prototype = {
	createProxy: function(aabb,userData) {
		var node = this.allocateNode();
		var extendX = box2D.common.B2Settings.b2_aabbExtension;
		var extendY = box2D.common.B2Settings.b2_aabbExtension;
		node.aabb.lowerBound.x = aabb.lowerBound.x - extendX;
		node.aabb.lowerBound.y = aabb.lowerBound.y - extendY;
		node.aabb.upperBound.x = aabb.upperBound.x + extendX;
		node.aabb.upperBound.y = aabb.upperBound.y + extendY;
		node.userData = userData;
		this.insertLeaf(node);
		return node;
	}
	,moveProxy: function(proxy,aabb,displacement) {
		box2D.common.B2Settings.b2Assert(proxy.isLeaf());
		if(proxy.aabb.contains(aabb)) return false;
		this.removeLeaf(proxy);
		var extendX;
		extendX = box2D.common.B2Settings.b2_aabbExtension + box2D.common.B2Settings.b2_aabbMultiplier * (displacement.x > 0?displacement.x:-displacement.x);
		var extendY;
		extendY = box2D.common.B2Settings.b2_aabbExtension + box2D.common.B2Settings.b2_aabbMultiplier * (displacement.y > 0?displacement.y:-displacement.y);
		proxy.aabb.lowerBound.x = aabb.lowerBound.x - extendX;
		proxy.aabb.lowerBound.y = aabb.lowerBound.y - extendY;
		proxy.aabb.upperBound.x = aabb.upperBound.x + extendX;
		proxy.aabb.upperBound.y = aabb.upperBound.y + extendY;
		this.insertLeaf(proxy);
		return true;
	}
	,getFatAABB: function(proxy) {
		return proxy.aabb;
	}
	,getUserData: function(proxy) {
		return proxy.userData;
	}
	,query: function(callbackMethod,aabb) {
		if(this.m_root == null) return;
		var stack = new Array();
		var count = 0;
		stack[count++] = this.m_root;
		while(count > 0) {
			var node = stack[--count];
			if(node.aabb.testOverlap(aabb)) {
				if(node.isLeaf()) {
					var proceed = callbackMethod(node);
					if(!proceed) return;
				} else {
					stack[count++] = node.child1;
					stack[count++] = node.child2;
				}
			}
		}
	}
	,allocateNode: function() {
		if(this.m_freeList != null) {
			var node = this.m_freeList;
			this.m_freeList = node.parent;
			node.parent = null;
			node.child1 = null;
			node.child2 = null;
			return node;
		}
		return new box2D.collision.B2DynamicTreeNode();
	}
	,freeNode: function(node) {
		node.parent = this.m_freeList;
		this.m_freeList = node;
	}
	,insertLeaf: function(leaf) {
		++this.m_insertionCount;
		if(this.m_root == null) {
			this.m_root = leaf;
			this.m_root.parent = null;
			return;
		}
		var center = leaf.aabb.getCenter();
		var sibling = this.m_root;
		if(sibling.isLeaf() == false) do {
			var child1 = sibling.child1;
			var child2 = sibling.child2;
			var norm1 = Math.abs((child1.aabb.lowerBound.x + child1.aabb.upperBound.x) / 2 - center.x) + Math.abs((child1.aabb.lowerBound.y + child1.aabb.upperBound.y) / 2 - center.y);
			var norm2 = Math.abs((child2.aabb.lowerBound.x + child2.aabb.upperBound.x) / 2 - center.x) + Math.abs((child2.aabb.lowerBound.y + child2.aabb.upperBound.y) / 2 - center.y);
			if(norm1 < norm2) sibling = child1; else sibling = child2;
		} while(sibling.isLeaf() == false);
		var node1 = sibling.parent;
		var node2 = this.allocateNode();
		node2.parent = node1;
		node2.userData = null;
		node2.aabb.combine(leaf.aabb,sibling.aabb);
		if(node1 != null) {
			if(sibling.parent.child1 == sibling) node1.child1 = node2; else node1.child2 = node2;
			node2.child1 = sibling;
			node2.child2 = leaf;
			sibling.parent = node2;
			leaf.parent = node2;
			do {
				if(node1.aabb.contains(node2.aabb)) break;
				node1.aabb.combine(node1.child1.aabb,node1.child2.aabb);
				node2 = node1;
				node1 = node1.parent;
			} while(node1 != null);
		} else {
			node2.child1 = sibling;
			node2.child2 = leaf;
			sibling.parent = node2;
			leaf.parent = node2;
			this.m_root = node2;
		}
	}
	,removeLeaf: function(leaf) {
		if(leaf == this.m_root) {
			this.m_root = null;
			return;
		}
		var node2 = leaf.parent;
		var node1 = node2.parent;
		var sibling;
		if(node2.child1 == leaf) sibling = node2.child2; else sibling = node2.child1;
		if(node1 != null) {
			if(node1.child1 == node2) node1.child1 = sibling; else node1.child2 = sibling;
			sibling.parent = node1;
			this.freeNode(node2);
			while(node1 != null) {
				var oldAABB = node1.aabb;
				node1.aabb = new box2D.collision.B2AABB();
				node1.aabb.combine(node1.child1.aabb,node1.child2.aabb);
				if(oldAABB.contains(node1.aabb)) break;
				node1 = node1.parent;
			}
		} else {
			this.m_root = sibling;
			sibling.parent = null;
			this.freeNode(node2);
		}
	}
	,__class__: box2D.collision.B2DynamicTree
};
box2D.dynamics.contacts.B2PositionSolverManifold = function() {
	this.m_normal = new box2D.common.math.B2Vec2();
	this.m_separations = new Array();
	this.m_points = new Array();
	var _g1 = 0;
	var _g = box2D.common.B2Settings.b2_maxManifoldPoints;
	while(_g1 < _g) {
		var i = _g1++;
		this.m_points[i] = new box2D.common.math.B2Vec2();
	}
};
$hxClasses["box2D.dynamics.contacts.B2PositionSolverManifold"] = box2D.dynamics.contacts.B2PositionSolverManifold;
box2D.dynamics.contacts.B2PositionSolverManifold.__name__ = true;
box2D.dynamics.contacts.B2PositionSolverManifold.prototype = {
	initialize: function(cc) {
		box2D.common.B2Settings.b2Assert(cc.pointCount > 0);
		var i;
		var clipPointX;
		var clipPointY;
		var tMat;
		var tVec;
		var planePointX;
		var planePointY;
		var _g = cc.type;
		switch(_g[1]) {
		case 0:
			tMat = cc.bodyA.m_xf.R;
			tVec = cc.localPoint;
			var pointAX = cc.bodyA.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
			var pointAY = cc.bodyA.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
			tMat = cc.bodyB.m_xf.R;
			tVec = cc.points[0].localPoint;
			var pointBX = cc.bodyB.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
			var pointBY = cc.bodyB.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
			var dX = pointBX - pointAX;
			var dY = pointBY - pointAY;
			var d2 = dX * dX + dY * dY;
			if(d2 > Number.MIN_VALUE * Number.MIN_VALUE) {
				var d = Math.sqrt(d2);
				this.m_normal.x = dX / d;
				this.m_normal.y = dY / d;
			} else {
				this.m_normal.x = 1.0;
				this.m_normal.y = 0.0;
			}
			this.m_points[0].x = 0.5 * (pointAX + pointBX);
			this.m_points[0].y = 0.5 * (pointAY + pointBY);
			this.m_separations[0] = dX * this.m_normal.x + dY * this.m_normal.y - cc.radius;
			break;
		case 1:
			tMat = cc.bodyA.m_xf.R;
			tVec = cc.localPlaneNormal;
			this.m_normal.x = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
			this.m_normal.y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
			tMat = cc.bodyA.m_xf.R;
			tVec = cc.localPoint;
			planePointX = cc.bodyA.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
			planePointY = cc.bodyA.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
			tMat = cc.bodyB.m_xf.R;
			var _g2 = 0;
			var _g1 = cc.pointCount;
			while(_g2 < _g1) {
				var i1 = _g2++;
				tVec = cc.points[i1].localPoint;
				clipPointX = cc.bodyB.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
				clipPointY = cc.bodyB.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
				this.m_separations[i1] = (clipPointX - planePointX) * this.m_normal.x + (clipPointY - planePointY) * this.m_normal.y - cc.radius;
				this.m_points[i1].x = clipPointX;
				this.m_points[i1].y = clipPointY;
			}
			break;
		case 2:
			tMat = cc.bodyB.m_xf.R;
			tVec = cc.localPlaneNormal;
			this.m_normal.x = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
			this.m_normal.y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
			tMat = cc.bodyB.m_xf.R;
			tVec = cc.localPoint;
			planePointX = cc.bodyB.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
			planePointY = cc.bodyB.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
			tMat = cc.bodyA.m_xf.R;
			var _g21 = 0;
			var _g11 = cc.pointCount;
			while(_g21 < _g11) {
				var i2 = _g21++;
				tVec = cc.points[i2].localPoint;
				clipPointX = cc.bodyA.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
				clipPointY = cc.bodyA.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
				this.m_separations[i2] = (clipPointX - planePointX) * this.m_normal.x + (clipPointY - planePointY) * this.m_normal.y - cc.radius;
				this.m_points[i2].set(clipPointX,clipPointY);
			}
			this.m_normal.x *= -1;
			this.m_normal.y *= -1;
			break;
		}
	}
	,__class__: box2D.dynamics.contacts.B2PositionSolverManifold
};
Math.__name__ = true;
box2D.common.B2Settings = function() { };
$hxClasses["box2D.common.B2Settings"] = box2D.common.B2Settings;
box2D.common.B2Settings.__name__ = true;
box2D.common.B2Settings.b2MixFriction = function(friction1,friction2) {
	return Math.sqrt(friction1 * friction2);
};
box2D.common.B2Settings.b2MixRestitution = function(restitution1,restitution2) {
	if(restitution1 > restitution2) return restitution1; else return restitution2;
};
box2D.common.B2Settings.b2Assert = function(a) {
	if(!a) throw "Assertion Failed";
};
box2D.collision.B2WorldManifold = function() {
	this.m_normal = new box2D.common.math.B2Vec2();
	this.m_points = new Array();
	var _g1 = 0;
	var _g = box2D.common.B2Settings.b2_maxManifoldPoints;
	while(_g1 < _g) {
		var i = _g1++;
		this.m_points[i] = new box2D.common.math.B2Vec2();
	}
};
$hxClasses["box2D.collision.B2WorldManifold"] = box2D.collision.B2WorldManifold;
box2D.collision.B2WorldManifold.__name__ = true;
box2D.collision.B2WorldManifold.prototype = {
	initialize: function(manifold,xfA,radiusA,xfB,radiusB) {
		if(manifold.m_pointCount == 0) return;
		var i;
		var tVec;
		var tMat;
		var normalX;
		var normalY;
		var planePointX;
		var planePointY;
		var clipPointX;
		var clipPointY;
		var _g = manifold.m_type;
		switch(_g[1]) {
		case 0:
			tMat = xfA.R;
			tVec = manifold.m_localPoint;
			var pointAX = xfA.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
			var pointAY = xfA.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
			tMat = xfB.R;
			tVec = manifold.m_points[0].m_localPoint;
			var pointBX = xfB.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
			var pointBY = xfB.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
			var dX = pointBX - pointAX;
			var dY = pointBY - pointAY;
			var d2 = dX * dX + dY * dY;
			if(d2 > Number.MIN_VALUE * Number.MIN_VALUE) {
				var d = Math.sqrt(d2);
				this.m_normal.x = dX / d;
				this.m_normal.y = dY / d;
			} else {
				this.m_normal.x = 1;
				this.m_normal.y = 0;
			}
			var cAX = pointAX + radiusA * this.m_normal.x;
			var cAY = pointAY + radiusA * this.m_normal.y;
			var cBX = pointBX - radiusB * this.m_normal.x;
			var cBY = pointBY - radiusB * this.m_normal.y;
			this.m_points[0].x = 0.5 * (cAX + cBX);
			this.m_points[0].y = 0.5 * (cAY + cBY);
			break;
		case 1:
			tMat = xfA.R;
			tVec = manifold.m_localPlaneNormal;
			normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
			normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
			tMat = xfA.R;
			tVec = manifold.m_localPoint;
			planePointX = xfA.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
			planePointY = xfA.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
			this.m_normal.x = normalX;
			this.m_normal.y = normalY;
			var _g2 = 0;
			var _g1 = manifold.m_pointCount;
			while(_g2 < _g1) {
				var i1 = _g2++;
				tMat = xfB.R;
				tVec = manifold.m_points[i1].m_localPoint;
				clipPointX = xfB.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
				clipPointY = xfB.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
				this.m_points[i1].x = clipPointX + 0.5 * (radiusA - (clipPointX - planePointX) * normalX - (clipPointY - planePointY) * normalY - radiusB) * normalX;
				this.m_points[i1].y = clipPointY + 0.5 * (radiusA - (clipPointX - planePointX) * normalX - (clipPointY - planePointY) * normalY - radiusB) * normalY;
			}
			break;
		case 2:
			tMat = xfB.R;
			tVec = manifold.m_localPlaneNormal;
			normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
			normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
			tMat = xfB.R;
			tVec = manifold.m_localPoint;
			planePointX = xfB.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
			planePointY = xfB.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
			this.m_normal.x = -normalX;
			this.m_normal.y = -normalY;
			var _g21 = 0;
			var _g11 = manifold.m_pointCount;
			while(_g21 < _g11) {
				var i2 = _g21++;
				tMat = xfA.R;
				tVec = manifold.m_points[i2].m_localPoint;
				clipPointX = xfA.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
				clipPointY = xfA.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
				this.m_points[i2].x = clipPointX + 0.5 * (radiusB - (clipPointX - planePointX) * normalX - (clipPointY - planePointY) * normalY - radiusA) * normalX;
				this.m_points[i2].y = clipPointY + 0.5 * (radiusB - (clipPointX - planePointX) * normalX - (clipPointY - planePointY) * normalY - radiusA) * normalY;
			}
			break;
		}
	}
	,__class__: box2D.collision.B2WorldManifold
};
box2D.dynamics.contacts.B2ContactSolver = function() {
	this.m_step = new box2D.dynamics.B2TimeStep();
	this.m_constraints = new Array();
};
$hxClasses["box2D.dynamics.contacts.B2ContactSolver"] = box2D.dynamics.contacts.B2ContactSolver;
box2D.dynamics.contacts.B2ContactSolver.__name__ = true;
box2D.dynamics.contacts.B2ContactSolver.prototype = {
	initialize: function(step,contacts,contactCount,allocator) {
		var contact;
		this.m_step.set(step);
		this.m_allocator = allocator;
		var i;
		var tVec;
		var tMat;
		this.m_constraintCount = contactCount;
		while(this.m_constraints.length < this.m_constraintCount) this.m_constraints[this.m_constraints.length] = new box2D.dynamics.contacts.B2ContactConstraint();
		var _g = 0;
		while(_g < contactCount) {
			var i1 = _g++;
			contact = contacts[i1];
			var fixtureA = contact.m_fixtureA;
			var fixtureB = contact.m_fixtureB;
			var shapeA = fixtureA.m_shape;
			var shapeB = fixtureB.m_shape;
			var radiusA = shapeA.m_radius;
			var radiusB = shapeB.m_radius;
			var bodyA = fixtureA.m_body;
			var bodyB = fixtureB.m_body;
			var manifold = contact.getManifold();
			var friction = box2D.common.B2Settings.b2MixFriction(fixtureA.getFriction(),fixtureB.getFriction());
			var restitution = box2D.common.B2Settings.b2MixRestitution(fixtureA.getRestitution(),fixtureB.getRestitution());
			var vAX = bodyA.m_linearVelocity.x;
			var vAY = bodyA.m_linearVelocity.y;
			var vBX = bodyB.m_linearVelocity.x;
			var vBY = bodyB.m_linearVelocity.y;
			var wA = bodyA.m_angularVelocity;
			var wB = bodyB.m_angularVelocity;
			box2D.common.B2Settings.b2Assert(manifold.m_pointCount > 0);
			box2D.dynamics.contacts.B2ContactSolver.s_worldManifold.initialize(manifold,bodyA.m_xf,radiusA,bodyB.m_xf,radiusB);
			var normalX = box2D.dynamics.contacts.B2ContactSolver.s_worldManifold.m_normal.x;
			var normalY = box2D.dynamics.contacts.B2ContactSolver.s_worldManifold.m_normal.y;
			var cc = this.m_constraints[i1];
			cc.bodyA = bodyA;
			cc.bodyB = bodyB;
			cc.manifold = manifold;
			cc.normal.x = normalX;
			cc.normal.y = normalY;
			cc.pointCount = manifold.m_pointCount;
			cc.friction = friction;
			cc.restitution = restitution;
			cc.localPlaneNormal.x = manifold.m_localPlaneNormal.x;
			cc.localPlaneNormal.y = manifold.m_localPlaneNormal.y;
			cc.localPoint.x = manifold.m_localPoint.x;
			cc.localPoint.y = manifold.m_localPoint.y;
			cc.radius = radiusA + radiusB;
			cc.type = manifold.m_type;
			var _g2 = 0;
			var _g1 = cc.pointCount;
			while(_g2 < _g1) {
				var k = _g2++;
				var cp = manifold.m_points[k];
				var ccp = cc.points[k];
				ccp.normalImpulse = cp.m_normalImpulse;
				ccp.tangentImpulse = cp.m_tangentImpulse;
				ccp.localPoint.setV(cp.m_localPoint);
				var rAX = ccp.rA.x = box2D.dynamics.contacts.B2ContactSolver.s_worldManifold.m_points[k].x - bodyA.m_sweep.c.x;
				var rAY = ccp.rA.y = box2D.dynamics.contacts.B2ContactSolver.s_worldManifold.m_points[k].y - bodyA.m_sweep.c.y;
				var rBX = ccp.rB.x = box2D.dynamics.contacts.B2ContactSolver.s_worldManifold.m_points[k].x - bodyB.m_sweep.c.x;
				var rBY = ccp.rB.y = box2D.dynamics.contacts.B2ContactSolver.s_worldManifold.m_points[k].y - bodyB.m_sweep.c.y;
				var rnA = rAX * normalY - rAY * normalX;
				var rnB = rBX * normalY - rBY * normalX;
				rnA *= rnA;
				rnB *= rnB;
				var kNormal = bodyA.m_invMass + bodyB.m_invMass + bodyA.m_invI * rnA + bodyB.m_invI * rnB;
				ccp.normalMass = 1.0 / kNormal;
				var kEqualized = bodyA.m_mass * bodyA.m_invMass + bodyB.m_mass * bodyB.m_invMass;
				kEqualized += bodyA.m_mass * bodyA.m_invI * rnA + bodyB.m_mass * bodyB.m_invI * rnB;
				ccp.equalizedMass = 1.0 / kEqualized;
				var tangentX = normalY;
				var tangentY = -normalX;
				var rtA = rAX * tangentY - rAY * tangentX;
				var rtB = rBX * tangentY - rBY * tangentX;
				rtA *= rtA;
				rtB *= rtB;
				var kTangent = bodyA.m_invMass + bodyB.m_invMass + bodyA.m_invI * rtA + bodyB.m_invI * rtB;
				ccp.tangentMass = 1.0 / kTangent;
				ccp.velocityBias = 0.0;
				var tX = vBX + -wB * rBY - vAX - -wA * rAY;
				var tY = vBY + wB * rBX - vAY - wA * rAX;
				var vRel = cc.normal.x * tX + cc.normal.y * tY;
				if(vRel < -box2D.common.B2Settings.b2_velocityThreshold) ccp.velocityBias += -cc.restitution * vRel;
			}
			if(cc.pointCount == 2) {
				var ccp1 = cc.points[0];
				var ccp2 = cc.points[1];
				var invMassA = bodyA.m_invMass;
				var invIA = bodyA.m_invI;
				var invMassB = bodyB.m_invMass;
				var invIB = bodyB.m_invI;
				var rn1A = ccp1.rA.x * normalY - ccp1.rA.y * normalX;
				var rn1B = ccp1.rB.x * normalY - ccp1.rB.y * normalX;
				var rn2A = ccp2.rA.x * normalY - ccp2.rA.y * normalX;
				var rn2B = ccp2.rB.x * normalY - ccp2.rB.y * normalX;
				var k11 = invMassA + invMassB + invIA * rn1A * rn1A + invIB * rn1B * rn1B;
				var k22 = invMassA + invMassB + invIA * rn2A * rn2A + invIB * rn2B * rn2B;
				var k12 = invMassA + invMassB + invIA * rn1A * rn2A + invIB * rn1B * rn2B;
				var k_maxConditionNumber = 100.0;
				if(k11 * k11 < k_maxConditionNumber * (k11 * k22 - k12 * k12)) {
					cc.K.col1.set(k11,k12);
					cc.K.col2.set(k12,k22);
					cc.K.getInverse(cc.normalMass);
				} else cc.pointCount = 1;
			}
		}
	}
	,initVelocityConstraints: function(step) {
		var tVec;
		var tVec2;
		var tMat;
		var _g1 = 0;
		var _g = this.m_constraintCount;
		while(_g1 < _g) {
			var i = _g1++;
			var c = this.m_constraints[i];
			var bodyA = c.bodyA;
			var bodyB = c.bodyB;
			var invMassA = bodyA.m_invMass;
			var invIA = bodyA.m_invI;
			var invMassB = bodyB.m_invMass;
			var invIB = bodyB.m_invI;
			var normalX = c.normal.x;
			var normalY = c.normal.y;
			var tangentX = normalY;
			var tangentY = -normalX;
			var tX;
			var j;
			var tCount;
			if(step.warmStarting) {
				tCount = c.pointCount;
				var _g2 = 0;
				while(_g2 < tCount) {
					var j1 = _g2++;
					var ccp = c.points[j1];
					ccp.normalImpulse *= step.dtRatio;
					ccp.tangentImpulse *= step.dtRatio;
					var PX = ccp.normalImpulse * normalX + ccp.tangentImpulse * tangentX;
					var PY = ccp.normalImpulse * normalY + ccp.tangentImpulse * tangentY;
					bodyA.m_angularVelocity -= invIA * (ccp.rA.x * PY - ccp.rA.y * PX);
					bodyA.m_linearVelocity.x -= invMassA * PX;
					bodyA.m_linearVelocity.y -= invMassA * PY;
					bodyB.m_angularVelocity += invIB * (ccp.rB.x * PY - ccp.rB.y * PX);
					bodyB.m_linearVelocity.x += invMassB * PX;
					bodyB.m_linearVelocity.y += invMassB * PY;
				}
			} else {
				tCount = c.pointCount;
				var _g21 = 0;
				while(_g21 < tCount) {
					var j2 = _g21++;
					var ccp2 = c.points[j2];
					ccp2.normalImpulse = 0.0;
					ccp2.tangentImpulse = 0.0;
				}
			}
		}
	}
	,solveVelocityConstraints: function() {
		var j;
		var ccp;
		var rAX;
		var rAY;
		var rBX;
		var rBY;
		var dvX;
		var dvY;
		var vn;
		var vt;
		var lambda;
		var maxFriction;
		var newImpulse;
		var PX;
		var PY;
		var dX;
		var dY;
		var P1X;
		var P1Y;
		var P2X;
		var P2Y;
		var tMat;
		var tVec;
		var _g1 = 0;
		var _g = this.m_constraintCount;
		while(_g1 < _g) {
			var i = _g1++;
			var c = this.m_constraints[i];
			var bodyA = c.bodyA;
			var bodyB = c.bodyB;
			var wA = bodyA.m_angularVelocity;
			var wB = bodyB.m_angularVelocity;
			var vA = bodyA.m_linearVelocity;
			var vB = bodyB.m_linearVelocity;
			var invMassA = bodyA.m_invMass;
			var invIA = bodyA.m_invI;
			var invMassB = bodyB.m_invMass;
			var invIB = bodyB.m_invI;
			var normalX = c.normal.x;
			var normalY = c.normal.y;
			var tangentX = normalY;
			var tangentY = -normalX;
			var friction = c.friction;
			var tX;
			var _g3 = 0;
			var _g2 = c.pointCount;
			while(_g3 < _g2) {
				var j1 = _g3++;
				ccp = c.points[j1];
				dvX = vB.x - wB * ccp.rB.y - vA.x + wA * ccp.rA.y;
				dvY = vB.y + wB * ccp.rB.x - vA.y - wA * ccp.rA.x;
				vt = dvX * tangentX + dvY * tangentY;
				lambda = ccp.tangentMass * -vt;
				maxFriction = friction * ccp.normalImpulse;
				newImpulse = box2D.common.math.B2Math.clamp(ccp.tangentImpulse + lambda,-maxFriction,maxFriction);
				lambda = newImpulse - ccp.tangentImpulse;
				PX = lambda * tangentX;
				PY = lambda * tangentY;
				vA.x -= invMassA * PX;
				vA.y -= invMassA * PY;
				wA -= invIA * (ccp.rA.x * PY - ccp.rA.y * PX);
				vB.x += invMassB * PX;
				vB.y += invMassB * PY;
				wB += invIB * (ccp.rB.x * PY - ccp.rB.y * PX);
				ccp.tangentImpulse = newImpulse;
			}
			var tCount = c.pointCount;
			if(c.pointCount == 1) {
				ccp = c.points[0];
				dvX = vB.x + -wB * ccp.rB.y - vA.x - -wA * ccp.rA.y;
				dvY = vB.y + wB * ccp.rB.x - vA.y - wA * ccp.rA.x;
				vn = dvX * normalX + dvY * normalY;
				lambda = -ccp.normalMass * (vn - ccp.velocityBias);
				newImpulse = ccp.normalImpulse + lambda;
				if(newImpulse > 0) newImpulse = newImpulse; else newImpulse = 0.0;
				lambda = newImpulse - ccp.normalImpulse;
				PX = lambda * normalX;
				PY = lambda * normalY;
				vA.x -= invMassA * PX;
				vA.y -= invMassA * PY;
				wA -= invIA * (ccp.rA.x * PY - ccp.rA.y * PX);
				vB.x += invMassB * PX;
				vB.y += invMassB * PY;
				wB += invIB * (ccp.rB.x * PY - ccp.rB.y * PX);
				ccp.normalImpulse = newImpulse;
			} else {
				var cp1 = c.points[0];
				var cp2 = c.points[1];
				var aX = cp1.normalImpulse;
				var aY = cp2.normalImpulse;
				var dv1X = vB.x - wB * cp1.rB.y - vA.x + wA * cp1.rA.y;
				var dv1Y = vB.y + wB * cp1.rB.x - vA.y - wA * cp1.rA.x;
				var dv2X = vB.x - wB * cp2.rB.y - vA.x + wA * cp2.rA.y;
				var dv2Y = vB.y + wB * cp2.rB.x - vA.y - wA * cp2.rA.x;
				var vn1 = dv1X * normalX + dv1Y * normalY;
				var vn2 = dv2X * normalX + dv2Y * normalY;
				var bX = vn1 - cp1.velocityBias;
				var bY = vn2 - cp2.velocityBias;
				tMat = c.K;
				bX -= tMat.col1.x * aX + tMat.col2.x * aY;
				bY -= tMat.col1.y * aX + tMat.col2.y * aY;
				var k_errorTol = 0.001;
				var _g21 = 0;
				while(_g21 < 1) {
					var i1 = _g21++;
					tMat = c.normalMass;
					var xX = -(tMat.col1.x * bX + tMat.col2.x * bY);
					var xY = -(tMat.col1.y * bX + tMat.col2.y * bY);
					if(xX >= 0.0 && xY >= 0.0) {
						dX = xX - aX;
						dY = xY - aY;
						P1X = dX * normalX;
						P1Y = dX * normalY;
						P2X = dY * normalX;
						P2Y = dY * normalY;
						vA.x -= invMassA * (P1X + P2X);
						vA.y -= invMassA * (P1Y + P2Y);
						wA -= invIA * (cp1.rA.x * P1Y - cp1.rA.y * P1X + cp2.rA.x * P2Y - cp2.rA.y * P2X);
						vB.x += invMassB * (P1X + P2X);
						vB.y += invMassB * (P1Y + P2Y);
						wB += invIB * (cp1.rB.x * P1Y - cp1.rB.y * P1X + cp2.rB.x * P2Y - cp2.rB.y * P2X);
						cp1.normalImpulse = xX;
						cp2.normalImpulse = xY;
						break;
					}
					xX = -cp1.normalMass * bX;
					xY = 0.0;
					vn1 = 0.0;
					vn2 = c.K.col1.y * xX + bY;
					if(xX >= 0.0 && vn2 >= 0.0) {
						dX = xX - aX;
						dY = xY - aY;
						P1X = dX * normalX;
						P1Y = dX * normalY;
						P2X = dY * normalX;
						P2Y = dY * normalY;
						vA.x -= invMassA * (P1X + P2X);
						vA.y -= invMassA * (P1Y + P2Y);
						wA -= invIA * (cp1.rA.x * P1Y - cp1.rA.y * P1X + cp2.rA.x * P2Y - cp2.rA.y * P2X);
						vB.x += invMassB * (P1X + P2X);
						vB.y += invMassB * (P1Y + P2Y);
						wB += invIB * (cp1.rB.x * P1Y - cp1.rB.y * P1X + cp2.rB.x * P2Y - cp2.rB.y * P2X);
						cp1.normalImpulse = xX;
						cp2.normalImpulse = xY;
						break;
					}
					xX = 0.0;
					xY = -cp2.normalMass * bY;
					vn1 = c.K.col2.x * xY + bX;
					vn2 = 0.0;
					if(xY >= 0.0 && vn1 >= 0.0) {
						dX = xX - aX;
						dY = xY - aY;
						P1X = dX * normalX;
						P1Y = dX * normalY;
						P2X = dY * normalX;
						P2Y = dY * normalY;
						vA.x -= invMassA * (P1X + P2X);
						vA.y -= invMassA * (P1Y + P2Y);
						wA -= invIA * (cp1.rA.x * P1Y - cp1.rA.y * P1X + cp2.rA.x * P2Y - cp2.rA.y * P2X);
						vB.x += invMassB * (P1X + P2X);
						vB.y += invMassB * (P1Y + P2Y);
						wB += invIB * (cp1.rB.x * P1Y - cp1.rB.y * P1X + cp2.rB.x * P2Y - cp2.rB.y * P2X);
						cp1.normalImpulse = xX;
						cp2.normalImpulse = xY;
						break;
					}
					xX = 0.0;
					xY = 0.0;
					vn1 = bX;
					vn2 = bY;
					if(vn1 >= 0.0 && vn2 >= 0.0) {
						dX = xX - aX;
						dY = xY - aY;
						P1X = dX * normalX;
						P1Y = dX * normalY;
						P2X = dY * normalX;
						P2Y = dY * normalY;
						vA.x -= invMassA * (P1X + P2X);
						vA.y -= invMassA * (P1Y + P2Y);
						wA -= invIA * (cp1.rA.x * P1Y - cp1.rA.y * P1X + cp2.rA.x * P2Y - cp2.rA.y * P2X);
						vB.x += invMassB * (P1X + P2X);
						vB.y += invMassB * (P1Y + P2Y);
						wB += invIB * (cp1.rB.x * P1Y - cp1.rB.y * P1X + cp2.rB.x * P2Y - cp2.rB.y * P2X);
						cp1.normalImpulse = xX;
						cp2.normalImpulse = xY;
						break;
					}
					break;
				}
			}
			bodyA.m_angularVelocity = wA;
			bodyB.m_angularVelocity = wB;
		}
	}
	,finalizeVelocityConstraints: function() {
		var _g1 = 0;
		var _g = this.m_constraintCount;
		while(_g1 < _g) {
			var i = _g1++;
			var c = this.m_constraints[i];
			var m = c.manifold;
			var _g3 = 0;
			var _g2 = c.pointCount;
			while(_g3 < _g2) {
				var j = _g3++;
				var point1 = m.m_points[j];
				var point2 = c.points[j];
				point1.m_normalImpulse = point2.normalImpulse;
				point1.m_tangentImpulse = point2.tangentImpulse;
			}
		}
	}
	,solvePositionConstraints: function(baumgarte) {
		var minSeparation = 0.0;
		var _g1 = 0;
		var _g = this.m_constraintCount;
		while(_g1 < _g) {
			var i = _g1++;
			var c = this.m_constraints[i];
			var bodyA = c.bodyA;
			var bodyB = c.bodyB;
			var invMassA = bodyA.m_mass * bodyA.m_invMass;
			var invIA = bodyA.m_mass * bodyA.m_invI;
			var invMassB = bodyB.m_mass * bodyB.m_invMass;
			var invIB = bodyB.m_mass * bodyB.m_invI;
			box2D.dynamics.contacts.B2ContactSolver.s_psm.initialize(c);
			var normal = box2D.dynamics.contacts.B2ContactSolver.s_psm.m_normal;
			var _g3 = 0;
			var _g2 = c.pointCount;
			while(_g3 < _g2) {
				var j = _g3++;
				var ccp = c.points[j];
				var point = box2D.dynamics.contacts.B2ContactSolver.s_psm.m_points[j];
				var separation = box2D.dynamics.contacts.B2ContactSolver.s_psm.m_separations[j];
				var rAX = point.x - bodyA.m_sweep.c.x;
				var rAY = point.y - bodyA.m_sweep.c.y;
				var rBX = point.x - bodyB.m_sweep.c.x;
				var rBY = point.y - bodyB.m_sweep.c.y;
				if(minSeparation < separation) minSeparation = minSeparation; else minSeparation = separation;
				var C = box2D.common.math.B2Math.clamp(baumgarte * (separation + box2D.common.B2Settings.b2_linearSlop),-box2D.common.B2Settings.b2_maxLinearCorrection,0.0);
				var impulse = -ccp.equalizedMass * C;
				var PX = impulse * normal.x;
				var PY = impulse * normal.y;
				bodyA.m_sweep.c.x -= invMassA * PX;
				bodyA.m_sweep.c.y -= invMassA * PY;
				bodyA.m_sweep.a -= invIA * (rAX * PY - rAY * PX);
				bodyA.synchronizeTransform();
				bodyB.m_sweep.c.x += invMassB * PX;
				bodyB.m_sweep.c.y += invMassB * PY;
				bodyB.m_sweep.a += invIB * (rBX * PY - rBY * PX);
				bodyB.synchronizeTransform();
			}
		}
		return minSeparation > -1.5 * box2D.common.B2Settings.b2_linearSlop;
	}
	,__class__: box2D.dynamics.contacts.B2ContactSolver
};
box2D.dynamics.B2ContactImpulse = function() {
	this.normalImpulses = new Array();
	this.tangentImpulses = new Array();
};
$hxClasses["box2D.dynamics.B2ContactImpulse"] = box2D.dynamics.B2ContactImpulse;
box2D.dynamics.B2ContactImpulse.__name__ = true;
box2D.dynamics.B2ContactImpulse.prototype = {
	__class__: box2D.dynamics.B2ContactImpulse
};
box2D.dynamics.B2Island = function() {
	this.m_bodies = new Array();
	this.m_contacts = new Array();
	this.m_joints = new Array();
};
$hxClasses["box2D.dynamics.B2Island"] = box2D.dynamics.B2Island;
box2D.dynamics.B2Island.__name__ = true;
box2D.dynamics.B2Island.prototype = {
	initialize: function(bodyCapacity,contactCapacity,jointCapacity,allocator,listener,contactSolver) {
		var i;
		this.m_bodyCapacity = bodyCapacity;
		this.m_contactCapacity = contactCapacity;
		this.m_jointCapacity = jointCapacity;
		this.m_bodyCount = 0;
		this.m_contactCount = 0;
		this.m_jointCount = 0;
		this.m_allocator = allocator;
		this.m_listener = listener;
		this.m_contactSolver = contactSolver;
		var _g = this.m_bodies.length;
		while(_g < bodyCapacity) {
			var i1 = _g++;
			this.m_bodies[i1] = null;
		}
		var _g1 = this.m_contacts.length;
		while(_g1 < contactCapacity) {
			var i2 = _g1++;
			this.m_contacts[i2] = null;
		}
		var _g2 = this.m_joints.length;
		while(_g2 < jointCapacity) {
			var i3 = _g2++;
			this.m_joints[i3] = null;
		}
	}
	,clear: function() {
		this.m_bodyCount = 0;
		this.m_contactCount = 0;
		this.m_jointCount = 0;
	}
	,solve: function(step,gravity,allowSleep) {
		var i;
		var j;
		var b;
		var joint;
		var _g1 = 0;
		var _g = this.m_bodyCount;
		while(_g1 < _g) {
			var i1 = _g1++;
			b = this.m_bodies[i1];
			if(b.getType() != box2D.dynamics.B2Body.b2_dynamicBody) continue;
			b.m_linearVelocity.x += step.dt * (gravity.x + b.m_invMass * b.m_force.x);
			b.m_linearVelocity.y += step.dt * (gravity.y + b.m_invMass * b.m_force.y);
			b.m_angularVelocity += step.dt * b.m_invI * b.m_torque;
			b.m_linearVelocity.multiply(box2D.common.math.B2Math.clamp(1.0 - step.dt * b.m_linearDamping,0.0,1.0));
			b.m_angularVelocity *= box2D.common.math.B2Math.clamp(1.0 - step.dt * b.m_angularDamping,0.0,1.0);
		}
		this.m_contactSolver.initialize(step,this.m_contacts,this.m_contactCount,this.m_allocator);
		var contactSolver = this.m_contactSolver;
		contactSolver.initVelocityConstraints(step);
		var _g11 = 0;
		var _g2 = this.m_jointCount;
		while(_g11 < _g2) {
			var i2 = _g11++;
			joint = this.m_joints[i2];
			joint.initVelocityConstraints(step);
		}
		var _g12 = 0;
		var _g3 = step.velocityIterations;
		while(_g12 < _g3) {
			var i3 = _g12++;
			var _g31 = 0;
			var _g21 = this.m_jointCount;
			while(_g31 < _g21) {
				var j1 = _g31++;
				joint = this.m_joints[j1];
				joint.solveVelocityConstraints(step);
			}
			contactSolver.solveVelocityConstraints();
		}
		var _g13 = 0;
		var _g4 = this.m_jointCount;
		while(_g13 < _g4) {
			var i4 = _g13++;
			joint = this.m_joints[i4];
			joint.finalizeVelocityConstraints();
		}
		contactSolver.finalizeVelocityConstraints();
		var _g14 = 0;
		var _g5 = this.m_bodyCount;
		while(_g14 < _g5) {
			var i5 = _g14++;
			b = this.m_bodies[i5];
			if(b.getType() == box2D.dynamics.B2Body.b2_staticBody) continue;
			var translationX = step.dt * b.m_linearVelocity.x;
			var translationY = step.dt * b.m_linearVelocity.y;
			if(translationX * translationX + translationY * translationY > box2D.common.B2Settings.b2_maxTranslationSquared) {
				b.m_linearVelocity.normalize();
				b.m_linearVelocity.x *= box2D.common.B2Settings.b2_maxTranslation * step.inv_dt;
				b.m_linearVelocity.y *= box2D.common.B2Settings.b2_maxTranslation * step.inv_dt;
			}
			var rotation = step.dt * b.m_angularVelocity;
			if(rotation * rotation > box2D.common.B2Settings.b2_maxRotationSquared) {
				if(b.m_angularVelocity < 0.0) b.m_angularVelocity = -box2D.common.B2Settings.b2_maxRotation * step.inv_dt; else b.m_angularVelocity = box2D.common.B2Settings.b2_maxRotation * step.inv_dt;
			}
			b.m_sweep.c0.setV(b.m_sweep.c);
			b.m_sweep.a0 = b.m_sweep.a;
			b.m_sweep.c.x += step.dt * b.m_linearVelocity.x;
			b.m_sweep.c.y += step.dt * b.m_linearVelocity.y;
			b.m_sweep.a += step.dt * b.m_angularVelocity;
			b.synchronizeTransform();
		}
		var _g15 = 0;
		var _g6 = step.positionIterations;
		while(_g15 < _g6) {
			var i6 = _g15++;
			var contactsOkay = contactSolver.solvePositionConstraints(box2D.common.B2Settings.b2_contactBaumgarte);
			var jointsOkay = true;
			var _g32 = 0;
			var _g22 = this.m_jointCount;
			while(_g32 < _g22) {
				var j2 = _g32++;
				joint = this.m_joints[j2];
				var jointOkay = joint.solvePositionConstraints(box2D.common.B2Settings.b2_contactBaumgarte);
				jointsOkay = jointsOkay && jointOkay;
			}
			if(contactsOkay && jointsOkay) break;
		}
		this.report(contactSolver.m_constraints);
		if(allowSleep) {
			var minSleepTime = Number.MAX_VALUE;
			var linTolSqr = box2D.common.B2Settings.b2_linearSleepTolerance * box2D.common.B2Settings.b2_linearSleepTolerance;
			var angTolSqr = box2D.common.B2Settings.b2_angularSleepTolerance * box2D.common.B2Settings.b2_angularSleepTolerance;
			var _g16 = 0;
			var _g7 = this.m_bodyCount;
			while(_g16 < _g7) {
				var i7 = _g16++;
				b = this.m_bodies[i7];
				if(b.getType() == box2D.dynamics.B2Body.b2_staticBody) continue;
				if((b.m_flags & box2D.dynamics.B2Body.e_allowSleepFlag) == 0) {
					b.m_sleepTime = 0.0;
					minSleepTime = 0.0;
				}
				if((b.m_flags & box2D.dynamics.B2Body.e_allowSleepFlag) == 0 || b.m_angularVelocity * b.m_angularVelocity > angTolSqr || box2D.common.math.B2Math.dot(b.m_linearVelocity,b.m_linearVelocity) > linTolSqr) {
					b.m_sleepTime = 0.0;
					minSleepTime = 0.0;
				} else {
					b.m_sleepTime += step.dt;
					minSleepTime = box2D.common.math.B2Math.min(minSleepTime,b.m_sleepTime);
				}
			}
			if(minSleepTime >= box2D.common.B2Settings.b2_timeToSleep) {
				var _g17 = 0;
				var _g8 = this.m_bodyCount;
				while(_g17 < _g8) {
					var i8 = _g17++;
					b = this.m_bodies[i8];
					b.setAwake(false);
				}
			}
		}
	}
	,solveTOI: function(subStep) {
		var i;
		var j;
		this.m_contactSolver.initialize(subStep,this.m_contacts,this.m_contactCount,this.m_allocator);
		var contactSolver = this.m_contactSolver;
		var _g1 = 0;
		var _g = this.m_jointCount;
		while(_g1 < _g) {
			var i1 = _g1++;
			this.m_joints[i1].initVelocityConstraints(subStep);
		}
		var _g11 = 0;
		var _g2 = subStep.velocityIterations;
		while(_g11 < _g2) {
			var i2 = _g11++;
			contactSolver.solveVelocityConstraints();
			var _g3 = 0;
			var _g21 = this.m_jointCount;
			while(_g3 < _g21) {
				var j1 = _g3++;
				this.m_joints[j1].solveVelocityConstraints(subStep);
			}
		}
		var _g12 = 0;
		var _g4 = this.m_bodyCount;
		while(_g12 < _g4) {
			var i3 = _g12++;
			var b = this.m_bodies[i3];
			if(b.getType() == box2D.dynamics.B2Body.b2_staticBody) continue;
			var translationX = subStep.dt * b.m_linearVelocity.x;
			var translationY = subStep.dt * b.m_linearVelocity.y;
			if(translationX * translationX + translationY * translationY > box2D.common.B2Settings.b2_maxTranslationSquared) {
				b.m_linearVelocity.normalize();
				b.m_linearVelocity.x *= box2D.common.B2Settings.b2_maxTranslation * subStep.inv_dt;
				b.m_linearVelocity.y *= box2D.common.B2Settings.b2_maxTranslation * subStep.inv_dt;
			}
			var rotation = subStep.dt * b.m_angularVelocity;
			if(rotation * rotation > box2D.common.B2Settings.b2_maxRotationSquared) {
				if(b.m_angularVelocity < 0.0) b.m_angularVelocity = -box2D.common.B2Settings.b2_maxRotation * subStep.inv_dt; else b.m_angularVelocity = box2D.common.B2Settings.b2_maxRotation * subStep.inv_dt;
			}
			b.m_sweep.c0.setV(b.m_sweep.c);
			b.m_sweep.a0 = b.m_sweep.a;
			b.m_sweep.c.x += subStep.dt * b.m_linearVelocity.x;
			b.m_sweep.c.y += subStep.dt * b.m_linearVelocity.y;
			b.m_sweep.a += subStep.dt * b.m_angularVelocity;
			b.synchronizeTransform();
		}
		var k_toiBaumgarte = 0.75;
		var _g13 = 0;
		var _g5 = subStep.positionIterations;
		while(_g13 < _g5) {
			var i4 = _g13++;
			var contactsOkay = contactSolver.solvePositionConstraints(k_toiBaumgarte);
			var jointsOkay = true;
			var _g31 = 0;
			var _g22 = this.m_jointCount;
			while(_g31 < _g22) {
				var j2 = _g31++;
				var jointOkay = this.m_joints[j2].solvePositionConstraints(box2D.common.B2Settings.b2_contactBaumgarte);
				jointsOkay = jointsOkay && jointOkay;
			}
			if(contactsOkay && jointsOkay) break;
		}
		this.report(contactSolver.m_constraints);
	}
	,report: function(constraints) {
		if(this.m_listener == null) return;
		var _g1 = 0;
		var _g = this.m_contactCount;
		while(_g1 < _g) {
			var i = _g1++;
			var c = this.m_contacts[i];
			var cc = constraints[i];
			var _g3 = 0;
			var _g2 = cc.pointCount;
			while(_g3 < _g2) {
				var j = _g3++;
				box2D.dynamics.B2Island.s_impulse.normalImpulses[j] = cc.points[j].normalImpulse;
				box2D.dynamics.B2Island.s_impulse.tangentImpulses[j] = cc.points[j].tangentImpulse;
			}
			this.m_listener.postSolve(c,box2D.dynamics.B2Island.s_impulse);
		}
	}
	,addBody: function(body) {
		body.m_islandIndex = this.m_bodyCount;
		this.m_bodies[this.m_bodyCount++] = body;
	}
	,addContact: function(contact) {
		this.m_contacts[this.m_contactCount++] = contact;
	}
	,addJoint: function(joint) {
		this.m_joints[this.m_jointCount++] = joint;
	}
	,__class__: box2D.dynamics.B2Island
};
box2D.dynamics.B2BodyDef = function() {
	this.position = new box2D.common.math.B2Vec2();
	this.linearVelocity = new box2D.common.math.B2Vec2();
	this.userData = null;
	this.angle = 0.0;
	this.angularVelocity = 0.0;
	this.linearDamping = 0.0;
	this.angularDamping = 0.0;
	this.allowSleep = true;
	this.awake = true;
	this.fixedRotation = false;
	this.bullet = false;
	this.type = box2D.dynamics.B2Body.b2_staticBody;
	this.active = true;
	this.inertiaScale = 1.0;
};
$hxClasses["box2D.dynamics.B2BodyDef"] = box2D.dynamics.B2BodyDef;
box2D.dynamics.B2BodyDef.__name__ = true;
box2D.dynamics.B2BodyDef.prototype = {
	__class__: box2D.dynamics.B2BodyDef
};
box2D.dynamics.B2Body = function(bd,world) {
	this.m_xf = new box2D.common.math.B2Transform();
	this.m_sweep = new box2D.common.math.B2Sweep();
	this.m_linearVelocity = new box2D.common.math.B2Vec2();
	this.m_force = new box2D.common.math.B2Vec2();
	this.m_flags = 0;
	if(bd.bullet) this.m_flags |= box2D.dynamics.B2Body.e_bulletFlag;
	if(bd.fixedRotation) this.m_flags |= box2D.dynamics.B2Body.e_fixedRotationFlag;
	if(bd.allowSleep) this.m_flags |= box2D.dynamics.B2Body.e_allowSleepFlag;
	if(bd.awake) this.m_flags |= box2D.dynamics.B2Body.e_awakeFlag;
	if(bd.active) this.m_flags |= box2D.dynamics.B2Body.e_activeFlag;
	this.m_world = world;
	this.m_xf.position.setV(bd.position);
	this.m_xf.R.set(bd.angle);
	this.m_sweep.localCenter.setZero();
	this.m_sweep.t0 = 1.0;
	this.m_sweep.a0 = this.m_sweep.a = bd.angle;
	var tMat = this.m_xf.R;
	var tVec = this.m_sweep.localCenter;
	this.m_sweep.c.x = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
	this.m_sweep.c.y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
	this.m_sweep.c.x += this.m_xf.position.x;
	this.m_sweep.c.y += this.m_xf.position.y;
	this.m_sweep.c0.setV(this.m_sweep.c);
	this.m_jointList = null;
	this.m_controllerList = null;
	this.m_contactList = null;
	this.m_controllerCount = 0;
	this.m_prev = null;
	this.m_next = null;
	this.m_linearVelocity.setV(bd.linearVelocity);
	this.m_angularVelocity = bd.angularVelocity;
	this.m_linearDamping = bd.linearDamping;
	this.m_angularDamping = bd.angularDamping;
	this.m_force.set(0.0,0.0);
	this.m_torque = 0.0;
	this.m_sleepTime = 0.0;
	this.m_type = bd.type;
	if(this.m_type == box2D.dynamics.B2Body.b2_dynamicBody) {
		this.m_mass = 1.0;
		this.m_invMass = 1.0;
	} else {
		this.m_mass = 0.0;
		this.m_invMass = 0.0;
	}
	this.m_I = 0.0;
	this.m_invI = 0.0;
	this.m_inertiaScale = bd.inertiaScale;
	this.m_userData = bd.userData;
	this.m_fixtureList = null;
	this.m_fixtureCount = 0;
};
$hxClasses["box2D.dynamics.B2Body"] = box2D.dynamics.B2Body;
box2D.dynamics.B2Body.__name__ = true;
box2D.dynamics.B2Body.prototype = {
	createFixture: function(def) {
		if(this.m_world.isLocked() == true) return null;
		var fixture = new box2D.dynamics.B2Fixture();
		fixture.create(this,this.m_xf,def);
		if((this.m_flags & box2D.dynamics.B2Body.e_activeFlag) != 0) {
			var broadPhase = this.m_world.m_contactManager.m_broadPhase;
			fixture.createProxy(broadPhase,this.m_xf);
		}
		fixture.m_next = this.m_fixtureList;
		this.m_fixtureList = fixture;
		++this.m_fixtureCount;
		fixture.m_body = this;
		if(fixture.m_density > 0.0) this.resetMassData();
		this.m_world.m_flags |= box2D.dynamics.B2World.e_newFixture;
		return fixture;
	}
	,setPositionAndAngle: function(position,angle) {
		var f;
		if(this.m_world.isLocked() == true) return;
		this.m_xf.R.set(angle);
		this.m_xf.position.setV(position);
		var tMat = this.m_xf.R;
		var tVec = this.m_sweep.localCenter;
		this.m_sweep.c.x = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
		this.m_sweep.c.y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
		this.m_sweep.c.x += this.m_xf.position.x;
		this.m_sweep.c.y += this.m_xf.position.y;
		this.m_sweep.c0.setV(this.m_sweep.c);
		this.m_sweep.a0 = this.m_sweep.a = angle;
		var broadPhase = this.m_world.m_contactManager.m_broadPhase;
		f = this.m_fixtureList;
		while(f != null) {
			f.synchronize(broadPhase,this.m_xf,this.m_xf);
			f = f.m_next;
		}
		this.m_world.m_contactManager.findNewContacts();
	}
	,getTransform: function() {
		return this.m_xf;
	}
	,getPosition: function() {
		return this.m_xf.position;
	}
	,setPosition: function(position) {
		this.setPositionAndAngle(position,this.getAngle());
	}
	,getAngle: function() {
		return this.m_sweep.a;
	}
	,getWorldCenter: function() {
		return this.m_sweep.c;
	}
	,getLinearVelocity: function() {
		return this.m_linearVelocity;
	}
	,applyImpulse: function(impulse,point) {
		if(this.m_type != box2D.dynamics.B2Body.b2_dynamicBody) return;
		if(this.isAwake() == false) this.setAwake(true);
		this.m_linearVelocity.x += this.m_invMass * impulse.x;
		this.m_linearVelocity.y += this.m_invMass * impulse.y;
		this.m_angularVelocity += this.m_invI * ((point.x - this.m_sweep.c.x) * impulse.y - (point.y - this.m_sweep.c.y) * impulse.x);
	}
	,setMassData: function(massData) {
		box2D.common.B2Settings.b2Assert(this.m_world.isLocked() == false);
		if(this.m_world.isLocked() == true) return;
		if(this.m_type != box2D.dynamics.B2Body.b2_dynamicBody) return;
		this.m_invMass = 0.0;
		this.m_I = 0.0;
		this.m_invI = 0.0;
		this.m_mass = massData.mass;
		if(this.m_mass <= 0.0) this.m_mass = 1.0;
		this.m_invMass = 1.0 / this.m_mass;
		if(massData.I > 0.0 && (this.m_flags & box2D.dynamics.B2Body.e_fixedRotationFlag) == 0) {
			this.m_I = massData.I - this.m_mass * (massData.center.x * massData.center.x + massData.center.y * massData.center.y);
			this.m_invI = 1.0 / this.m_I;
		}
		var oldCenter = this.m_sweep.c.copy();
		this.m_sweep.localCenter.setV(massData.center);
		this.m_sweep.c0.setV(box2D.common.math.B2Math.mulX(this.m_xf,this.m_sweep.localCenter));
		this.m_sweep.c.setV(this.m_sweep.c0);
		this.m_linearVelocity.x += this.m_angularVelocity * -(this.m_sweep.c.y - oldCenter.y);
		this.m_linearVelocity.y += this.m_angularVelocity * (this.m_sweep.c.x - oldCenter.x);
	}
	,resetMassData: function() {
		this.m_mass = 0.0;
		this.m_invMass = 0.0;
		this.m_I = 0.0;
		this.m_invI = 0.0;
		this.m_sweep.localCenter.setZero();
		if(this.m_type == box2D.dynamics.B2Body.b2_staticBody || this.m_type == box2D.dynamics.B2Body.b2_kinematicBody) return;
		var center = box2D.common.math.B2Vec2.make(0,0);
		var f = this.m_fixtureList;
		while(f != null) {
			if(f.m_density == 0.0) continue;
			var massData = f.getMassData();
			this.m_mass += massData.mass;
			center.x += massData.center.x * massData.mass;
			center.y += massData.center.y * massData.mass;
			this.m_I += massData.I;
			f = f.m_next;
		}
		if(this.m_mass > 0.0) {
			this.m_invMass = 1.0 / this.m_mass;
			center.x *= this.m_invMass;
			center.y *= this.m_invMass;
		} else {
			this.m_mass = 1.0;
			this.m_invMass = 1.0;
		}
		if(this.m_I > 0.0 && (this.m_flags & box2D.dynamics.B2Body.e_fixedRotationFlag) == 0) {
			this.m_I -= this.m_mass * (center.x * center.x + center.y * center.y);
			this.m_I *= this.m_inertiaScale;
			box2D.common.B2Settings.b2Assert(this.m_I > 0);
			this.m_invI = 1.0 / this.m_I;
		} else {
			this.m_I = 0.0;
			this.m_invI = 0.0;
		}
		var oldCenter = this.m_sweep.c.copy();
		this.m_sweep.localCenter.setV(center);
		this.m_sweep.c0.setV(box2D.common.math.B2Math.mulX(this.m_xf,this.m_sweep.localCenter));
		this.m_sweep.c.setV(this.m_sweep.c0);
		this.m_linearVelocity.x += this.m_angularVelocity * -(this.m_sweep.c.y - oldCenter.y);
		this.m_linearVelocity.y += this.m_angularVelocity * (this.m_sweep.c.x - oldCenter.x);
	}
	,setLinearDamping: function(linearDamping) {
		this.m_linearDamping = linearDamping;
	}
	,getType: function() {
		return this.m_type;
	}
	,isBullet: function() {
		return (this.m_flags & box2D.dynamics.B2Body.e_bulletFlag) == box2D.dynamics.B2Body.e_bulletFlag;
	}
	,setAwake: function(flag) {
		if(flag) {
			this.m_flags |= box2D.dynamics.B2Body.e_awakeFlag;
			this.m_sleepTime = 0.0;
		} else {
			this.m_flags &= ~box2D.dynamics.B2Body.e_awakeFlag;
			this.m_sleepTime = 0.0;
			this.m_linearVelocity.setZero();
			this.m_angularVelocity = 0.0;
			this.m_force.setZero();
			this.m_torque = 0.0;
		}
	}
	,isAwake: function() {
		return (this.m_flags & box2D.dynamics.B2Body.e_awakeFlag) == box2D.dynamics.B2Body.e_awakeFlag;
	}
	,setFixedRotation: function(fixed) {
		if(fixed) this.m_flags |= box2D.dynamics.B2Body.e_fixedRotationFlag; else this.m_flags &= ~box2D.dynamics.B2Body.e_fixedRotationFlag;
		this.resetMassData();
	}
	,isActive: function() {
		return (this.m_flags & box2D.dynamics.B2Body.e_activeFlag) == box2D.dynamics.B2Body.e_activeFlag;
	}
	,getContactList: function() {
		return this.m_contactList;
	}
	,getUserData: function() {
		return this.m_userData;
	}
	,setUserData: function(data) {
		this.m_userData = data;
	}
	,synchronizeFixtures: function() {
		var xf1 = box2D.dynamics.B2Body.s_xf1;
		xf1.R.set(this.m_sweep.a0);
		var tMat = xf1.R;
		var tVec = this.m_sweep.localCenter;
		xf1.position.x = this.m_sweep.c0.x - (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
		xf1.position.y = this.m_sweep.c0.y - (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
		var f;
		var broadPhase = this.m_world.m_contactManager.m_broadPhase;
		f = this.m_fixtureList;
		while(f != null) {
			f.synchronize(broadPhase,xf1,this.m_xf);
			f = f.m_next;
		}
	}
	,synchronizeTransform: function() {
		this.m_xf.R.set(this.m_sweep.a);
		var tMat = this.m_xf.R;
		var tVec = this.m_sweep.localCenter;
		this.m_xf.position.x = this.m_sweep.c.x - (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
		this.m_xf.position.y = this.m_sweep.c.y - (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
	}
	,shouldCollide: function(other) {
		if(this.m_type != box2D.dynamics.B2Body.b2_dynamicBody && other.m_type != box2D.dynamics.B2Body.b2_dynamicBody) return false;
		var jn = this.m_jointList;
		while(jn != null) {
			if(jn.other == other) {
				if(jn.joint.m_collideConnected == false) return false;
			}
			jn = jn.next;
		}
		return true;
	}
	,advance: function(t) {
		this.m_sweep.advance(t);
		this.m_sweep.c.setV(this.m_sweep.c0);
		this.m_sweep.a = this.m_sweep.a0;
		this.synchronizeTransform();
	}
	,__class__: box2D.dynamics.B2Body
};
var Main = function(engine) {
	this.canWin = false;
	this.test = new Array();
	this.checkpoints = new Array();
	hxd.App.call(this,engine);
};
$hxClasses["Main"] = Main;
Main.__name__ = true;
Main.main = function() {
	hxd.Res.loader = new hxd.res.Loader(new hxd.res.EmbedFileSystem(haxe.Unserializer.run("oy9:Thumbs.dbty16:treesTexture.pngty10:jungle.pngty18:jungle2Texture.pngty11:jungle3.fbxty16:shardTexture.pngty9:stars.pngty5:shardoR0tR5ty7:tmp.fbxty12:shard.blend1ty11:shard.blendtgy8:void.pngty8:glow.pngty7:end.pngty6:levelsoR0ty10:level3.pngty10:level4.pngty10:level1.pngty10:level2.pngtgy10:shard2.fbxty21:jungleBackground1.pngty9:trees.FBXty12:skyplane.pngty11:jungle2.FBXtg")));
	new Main();
};
Main.__super__ = hxd.App;
Main.prototype = $extend(hxd.App.prototype,{
	init: function() {
		Main.game = this;
		Data.init();
		Main.world.setContactListener(new ContactListener());
		this.s3d.camera.pos = new h3d.Vector(0,0,-31);
		this.levelId = Std.parseInt(js.Browser.getLocalStorage().getItem("level"));
		if(this.levelId == null) this.levelId = 0;
		this.ui = new UI(this.levelId);
		h3d.Engine.CURRENT.backgroundColor = -8341249;
		if(this.levelId > 0 && this.levelId < Main.maxLevel) {
			var _g = this.levelId;
			switch(_g) {
			case 1:
				this.currentLevel = hxd.Res.loader.loadImage("levels/level1.png");
				break;
			case 2:
				this.currentLevel = hxd.Res.loader.loadImage("levels/level2.png");
				break;
			case 3:
				this.currentLevel = hxd.Res.loader.loadImage("levels/level3.png");
				break;
			case 4:
				this.currentLevel = hxd.Res.loader.loadImage("levels/level4.png");
				break;
			default:
				throw "Can't load level " + Std.string(this.currentLevel);
			}
			this.level = this.loadLevel(this.currentLevel);
			this.update(0);
		}
	}
	,loadLevel: function(levelImage) {
		var _g = this;
		var level = new h3d.scene.Object(this.s3d);
		this.skyplane = new Plane(level,Data.skyplane,false,true);
		this.skyplane.set_z(1000);
		this.skyplane.scale(750);
		var _g1 = this.skyplane;
		_g1.set_scaleX(_g1.scaleX * 2);
		var o1 = new h3d.prim.FBXModel(Data.treesMesh);
		var m1 = new h3d.mat.MeshMaterial(Data.treesTexture);
		this.trees = new h3d.scene.Mesh(o1,m1,level);
		this.trees.rotate(0.0,Math.PI,0.0);
		this.trees.scale(5);
		this.trees.set_z(50);
		this.trees.set_y(0.1);
		this.trees.set_x(50);
		var o2 = new h3d.prim.FBXModel(Data.jungle2Mesh);
		var m2 = new h3d.mat.MeshMaterial(Data.jungle2Texture);
		this.trees = new h3d.scene.Mesh(o2,m2,level);
		this.trees.rotate(0.0,Math.PI,0.0);
		this.trees.scale(0.25);
		this.trees.set_z(10);
		this.trees.set_y(15);
		this.trees.set_x(10);
		var o21 = new h3d.prim.FBXModel(Data.jungle2Mesh);
		var m21 = new h3d.mat.MeshMaterial(Data.jungle2Texture);
		this.trees = new h3d.scene.Mesh(o21,m21,level);
		this.trees.rotate(0.0,Math.PI,0.0);
		this.trees.scale(0.25);
		this.trees.set_z(10);
		this.trees.set_y(15);
		this.trees.set_x(60);
		var startPosition_x = 0.0;
		var startPosition_y = 0.0;
		var levelBitmap = levelImage.toBitmap();
		var startPosition = { x : 0.0, y : 0.0};
		var below = false;
		var createBlock = function(color,x,y,side) {
			switch(color) {
			case -1:
				var block = new Wall(level,below);
				block.setPosition(x,y);
				_g.test.push(block);
				break;
			case -16711936:
				startPosition = { x : x, y : y};
				break;
			case -65536:
				var $void = new VoidBlock(level);
				$void.setPosition(x,y);
				break;
			case -16744448:
				var void1 = new End(level);
				void1.setPosition(x,y);
				break;
			case -256:
				var checkpoint = new Checkpoint(level,true);
				checkpoint.setPosition(x,y);
				_g.checkpoints.push(checkpoint);
				break;
			}
		};
		var _g11 = 0;
		var _g2 = levelBitmap.canvas.width;
		while(_g11 < _g2) {
			var x1 = _g11++;
			var _g3 = 0;
			var _g21 = levelBitmap.canvas.height / 2 | 0;
			while(_g3 < _g21) {
				var y1 = _g3++;
				var color1 = hxd._BitmapData.BitmapData_Impl_.canvasGetPixel(levelBitmap,x1,y1);
				below = y1 == 0 || hxd._BitmapData.BitmapData_Impl_.canvasGetPixel(levelBitmap,x1,y1 - 1) == -1;
				createBlock(color1,x1,10 - y1,true);
			}
		}
		this.character1 = new Character(this.s3d,1);
		this.character1.body.setPosition(new box2D.common.math.B2Vec2(startPosition.x,startPosition.y));
		var _g12 = 0;
		var _g4 = levelBitmap.canvas.width;
		while(_g12 < _g4) {
			var x2 = _g12++;
			var _g31 = levelBitmap.canvas.height / 2 | 0;
			var _g22 = levelBitmap.canvas.height;
			while(_g31 < _g22) {
				var y2 = _g31++;
				var color2 = hxd._BitmapData.BitmapData_Impl_.canvasGetPixel(levelBitmap,x2,y2);
				below = y2 == (levelBitmap.canvas.height / 2 | 0) || hxd._BitmapData.BitmapData_Impl_.canvasGetPixel(levelBitmap,x2,y2 - 1) == -1;
				var y3 = y2 - (levelBitmap.canvas.height / 2 | 0);
				createBlock(color2,x2,-y3,true);
			}
		}
		this.character2 = new Character(level,2);
		this.character2.body.setPosition(new box2D.common.math.B2Vec2(startPosition.x,startPosition.y));
		this.checkpoints.sort(function(x3,y4) {
			if(x3.x > y4.x) return 1; else if(x3.x < y4.x) return -1; else return 0;
		});
		this.checkpoint = new Checkpoint(level,false);
		this.checkpoint.setPosition(this.checkpoints[0].x,this.checkpoints[0].y);
		Data.bgm.play();
		return level;
	}
	,update: function(dt) {
		var t = hxd.Timer.deltaT;
		Main.world.step(hxd.Timer.deltaT,8,3);
		var dist = 5;
		this.character1.update(hxd.Timer.deltaT);
		this.character2.update(hxd.Timer.deltaT);
		var cameraX = (this.character1.x + this.character2.x) / 2;
		cameraX = Math.min(82.4,Math.max(17.6,cameraX));
		this.s3d.camera.pos = new h3d.Vector(cameraX,1,this.s3d.camera.pos.z);
		this.s3d.camera.target = new h3d.Vector(cameraX,1,(this.character1.x + this.character2.x) / 2);
		this.s3d.camera.up = new h3d.Vector(0,1,0);
		this.skyplane.set_x(this.s3d.camera.pos.x - 700);
		this.skyplane.set_y(this.s3d.camera.pos.y - 375);
		if(hxd.Key.isDown(HxOverrides.cca("R",0))) this.retry();
	}
	,validateCheckpoint: function() {
		var _g = this;
		var cpPos = this.checkpoints.shift();
		var nextPos = this.checkpoints[0];
		if(nextPos != null) {
			this.checkpoint.body.getUserData().type = BlockType.checkpointFlying;
			Data.win.play();
			cpPos.material.mshader.color__.w = 0.0;
			motion.Actuate.update(($_=this.checkpoint,$bind($_,$_.setPosition)),0.5,[cpPos.x,cpPos.y],[nextPos.x,nextPos.y]).ease(motion.easing.Quad.get_easeIn()).onComplete(function() {
				_g.checkpoint.body.getUserData().type = BlockType.checkpoint;
			});
			this.character1.accelerate();
			this.character2.accelerate();
		} else {
			this.checkpoint.body.getUserData().type = BlockType.checkpointFlying;
			Data.win.play();
			cpPos.material.mshader.color__.w = 0.0;
			motion.Actuate.update(($_=this.checkpoint,$bind($_,$_.setPosition)),0.5,[cpPos.x,cpPos.y],[120.0,0.0]).ease(motion.easing.Quad.get_easeIn()).onComplete(function() {
				_g.checkpoint.body.getUserData().type = BlockType.checkpoint;
			});
			this.canWin = true;
		}
	}
	,destroyCharacter: function() {
		Data.lose.play();
		motion.Actuate.update(($_=this.character1,$bind($_,$_.setAlpha)),0.5,[0.75],[0.0]);
		motion.Actuate.update(($_=this.character2,$bind($_,$_.setAlpha)),0.5,[0.75],[0.0]).onComplete($bind(this,this.retry));
		this.character1.alive = false;
		this.character2.alive = false;
	}
	,retry: function() {
		window.location.reload();
	}
	,win: function() {
		if(this.canWin) {
			window.location.reload();
			js.Browser.getLocalStorage().setItem("level","" + (this.levelId + 1) % (Main.maxLevel + 1));
		}
	}
	,__class__: Main
});
var IMap = function() { };
$hxClasses["IMap"] = IMap;
IMap.__name__ = true;
var Plane = function(parent,texture,transparent,invertY) {
	if(invertY == null) invertY = false;
	h3d.scene.Object.call(this,parent);
	this.mesh1 = new h3d.prim.Polygon([new h3d.col.Point(0,0,0),new h3d.col.Point(0,1,0),new h3d.col.Point(1,1,0)]);
	this.mesh2 = new h3d.prim.Polygon([new h3d.col.Point(0,0,0),new h3d.col.Point(1,1,0),new h3d.col.Point(1,0,0)]);
	this.mesh1.uvs = [new h3d.prim.UV(0,invertY?1:0),new h3d.prim.UV(0,invertY?0:1),new h3d.prim.UV(1,invertY?0:1)];
	this.mesh2.uvs = [new h3d.prim.UV(0,invertY?1:0),new h3d.prim.UV(1,invertY?0:1),new h3d.prim.UV(1,invertY?1:0)];
	this.material = new h3d.mat.MeshMaterial(texture);
	if(transparent) this.material.set_blendMode(1);
	var part1 = new h3d.scene.Mesh(this.mesh1,this.material,this);
	var part2 = new h3d.scene.Mesh(this.mesh2,this.material,this);
};
$hxClasses["Plane"] = Plane;
Plane.__name__ = true;
Plane.__super__ = h3d.scene.Object;
Plane.prototype = $extend(h3d.scene.Object.prototype,{
	__class__: Plane
});
var Reflect = function() { };
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = true;
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
Reflect.setField = function(o,field,value) {
	o[field] = value;
};
Reflect.getProperty = function(o,field) {
	var tmp;
	if(o == null) return null; else if(o.__properties__ && (tmp = o.__properties__["get_" + field])) return o[tmp](); else return o[field];
};
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
Reflect.compare = function(a,b) {
	if(a == b) return 0; else if(a > b) return 1; else return -1;
};
Reflect.isEnumValue = function(v) {
	return v != null && v.__enum__ != null;
};
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = true;
StringBuf.prototype = {
	add: function(x) {
		this.b += Std.string(x);
	}
	,addSub: function(s,pos,len) {
		if(len == null) this.b += HxOverrides.substr(s,pos,null); else this.b += HxOverrides.substr(s,pos,len);
	}
	,__class__: StringBuf
};
var StringTools = function() { };
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = true;
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c > 8 && c < 14 || c == 32;
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
};
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
var Type = function() { };
$hxClasses["Type"] = Type;
Type.__name__ = true;
Type.getClass = function(o) {
	if(o == null) return null;
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
};
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
};
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
};
Type.createInstance = function(cl,args) {
	var _g = args.length;
	switch(_g) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
};
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
};
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
};
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
};
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2;
		var _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e1 ) {
		return false;
	}
	return true;
};
Type.allEnums = function(e) {
	return e.__empty_constructs__;
};
var UI = function(levelId) {
	var element = window.document.querySelector("#ui");
	console.log(levelId);
	if(levelId == 0) {
		element.innerHTML = "<div style=\"text-align : center; color : white; font-family : sans-serif; font-size : 1.33em;\">\r\n\t\t\t<img src=\"logo.png\" style=\"width : 20%;\"/><br />\r\n\t\t\tHey there adventurer !<br />\r\n\t\t\tDo you know the story of the Rainbow Golem ?<br />\r\n\t\t\tThere once existed a giant creature made of colorful cristals<br />\r\n\t\t\tBut the beautiful beast was shattered into many pieces across different worlds !<br />\r\n\t\t\tThe shards remained linked and connected very distant worlds together.<br />\r\n\t\t\tIf your control can reach one, there's no doubt it will reach the others...<br />\r\n\t\t\t<div id=\"start\" style=\"margin : 10px; cursor : pointer; color : #80D0F0; border-radius : 5px; border : 1px solid #80D0F0; display : inline-block; padding : 5px;\" >Start the quest and bring together the shards !</div>";
		window.document.querySelector("#start").addEventListener("click",function(_) {
			js.Browser.getLocalStorage().setItem("level","1");
			window.location.reload();
		});
	} else if(levelId == Main.maxLevel) {
		element.innerHTML = "<div style=\"text-align : center; color : white; font-family : sans-serif; font-size : 1.33em;\">\r\n\t\t\t<img src=\"logo.png\" style=\"width : 20%;\"/><br />\r\n\t\t\tYou finished the game !<br />\r\n\t\t\tThank you for playing !<br />\r\n\t\t\tPlease comment and rate the game on the Ludum Dare website ! ; )<br />\r\n\t\t\tYou can follow me on twitter : <a target=\"_blank\" href=\"http://twitter.com/eolhing\">@eolhing</a><br />\r\n\t\t\t<div id=\"start\" style=\"margin : 10px; cursor : pointer; color : #80D0F0; border-radius : 5px; border : 1px solid #80D0F0; display : inline-block; padding : 5px;\" >Play  again !</div>";
		window.document.querySelector("#start").addEventListener("click",function(_1) {
			js.Browser.getLocalStorage().setItem("level","0");
			window.location.reload();
		});
	} else {
		var str;
		switch(levelId) {
		case 1:
			str = "Level 1 - Welcome ! Use arrow keys to move the shards and [Space] or [UP] to make them jump ! Collect all the parts and reach the end of the level ! If you get stuck, just press [R]";
			break;
		case 2:
			str = "Level 2 - You might have noticed it but the red areas in both worlds will throw the shards back at their origin !";
			break;
		default:
			str = "";
		}
		element.innerHTML = "<div style=\"font-family : sans-serif; display : inline-block; margin : 5px; padding : 5px; background-color : black; border-radius : 5px; color : white;\">" + str + "</div>";
	}
};
$hxClasses["UI"] = UI;
UI.__name__ = true;
UI.prototype = {
	__class__: UI
};
var VoidBlock = function(parent) {
	h3d.scene.Object.call(this,parent);
	var tex = hxd.Res.loader.loadImage("void.png").toTexture();
	var mat = new h3d.mat.MeshMaterial(tex);
	mat.set_blendMode(3);
	mat.mshader.color__.w = 0.5;
	var obj1 = new h3d.scene.Mesh(Data.cube,mat,this);
	var bodyDef = new box2D.dynamics.B2BodyDef();
	var bodyBox = new box2D.collision.shapes.B2PolygonShape();
	bodyBox.setAsBox(0.51,0.51);
	var fixtureDef = new box2D.dynamics.B2FixtureDef();
	fixtureDef.shape = bodyBox;
	fixtureDef.isSensor = true;
	this.body = Main.world.createBody(bodyDef);
	this.body.createFixture(fixtureDef);
	this.body.setUserData({ entity : this, type : BlockType["void"], grounded : false});
	this.body.setFixedRotation(true);
};
$hxClasses["VoidBlock"] = VoidBlock;
VoidBlock.__name__ = true;
VoidBlock.__super__ = h3d.scene.Object;
VoidBlock.prototype = $extend(h3d.scene.Object.prototype,{
	setPosition: function(x,y) {
		this.x = x;
		this.posChanged = true;
		x;
		this.y = y;
		this.posChanged = true;
		y;
		this.body.setPosition(new box2D.common.math.B2Vec2(x,y));
	}
	,__class__: VoidBlock
});
var Wall = function(parent,flip) {
	if(flip == null) flip = false;
	h3d.scene.Object.call(this,parent);
	var object = new h3d.prim.FBXModel(Data.jungleBlockMesh);
	var mat = new h3d.mat.MeshMaterial(Data.jungleBlockTexture);
	var obj = new h3d.scene.Mesh(object,mat,this);
	this.scale(0.5);
	obj.rotate(Math.PI / 2,0.0,Math.PI);
	var _g = obj;
	_g.set_x(_g.x + 1.0);
	var _g1 = obj;
	_g1.set_y(_g1.y + 1.0);
	if(flip) {
		var _g2 = obj;
		_g2.set_x(_g2.x - 2.0);
		this.setRotateAxis(0.0,1.0,0.0,Math.PI);
	}
	var bodyDef = new box2D.dynamics.B2BodyDef();
	var bodyBox = new box2D.collision.shapes.B2PolygonShape();
	bodyBox.setAsBox(0.51,0.51);
	var fixtureDef = new box2D.dynamics.B2FixtureDef();
	fixtureDef.shape = bodyBox;
	fixtureDef.density = 1.0;
	this.body = Main.world.createBody(bodyDef);
	this.body.createFixture(fixtureDef);
	this.body.setUserData({ entity : this, type : BlockType.wall, grounded : false});
	this.body.setFixedRotation(true);
};
$hxClasses["Wall"] = Wall;
Wall.__name__ = true;
Wall.__super__ = h3d.scene.Object;
Wall.prototype = $extend(h3d.scene.Object.prototype,{
	setPosition: function(x,y) {
		this.x = x;
		this.posChanged = true;
		x;
		this.y = y;
		this.posChanged = true;
		y;
		this.body.setPosition(new box2D.common.math.B2Vec2(x,y));
	}
	,__class__: Wall
});
var XmlType = $hxClasses["XmlType"] = { __ename__ : true, __constructs__ : [] };
XmlType.__empty_constructs__ = [];
var Xml = function() {
};
$hxClasses["Xml"] = Xml;
Xml.__name__ = true;
Xml.parse = function(str) {
	return haxe.xml.Parser.parse(str);
};
Xml.createElement = function(name) {
	var r = new Xml();
	r.nodeType = Xml.Element;
	r._children = new Array();
	r._attributes = new haxe.ds.StringMap();
	r.set_nodeName(name);
	return r;
};
Xml.createPCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.PCData;
	r.set_nodeValue(data);
	return r;
};
Xml.createCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.CData;
	r.set_nodeValue(data);
	return r;
};
Xml.createComment = function(data) {
	var r = new Xml();
	r.nodeType = Xml.Comment;
	r.set_nodeValue(data);
	return r;
};
Xml.createDocType = function(data) {
	var r = new Xml();
	r.nodeType = Xml.DocType;
	r.set_nodeValue(data);
	return r;
};
Xml.createProcessingInstruction = function(data) {
	var r = new Xml();
	r.nodeType = Xml.ProcessingInstruction;
	r.set_nodeValue(data);
	return r;
};
Xml.createDocument = function() {
	var r = new Xml();
	r.nodeType = Xml.Document;
	r._children = new Array();
	return r;
};
Xml.prototype = {
	get_nodeName: function() {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName;
	}
	,set_nodeName: function(n) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName = n;
	}
	,get_nodeValue: function() {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue;
	}
	,set_nodeValue: function(v) {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue = v;
	}
	,get: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.get(att);
	}
	,set: function(att,value) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		this._attributes.set(att,value);
	}
	,exists: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.exists(att);
	}
	,iterator: function() {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			return this.cur < this.x.length;
		}, next : function() {
			return this.x[this.cur++];
		}};
	}
	,elements: function() {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				if(this.x[k].nodeType == Xml.Element) break;
				k += 1;
			}
			this.cur = k;
			return k < l;
		}, next : function() {
			var k1 = this.cur;
			var l1 = this.x.length;
			while(k1 < l1) {
				var n = this.x[k1];
				k1 += 1;
				if(n.nodeType == Xml.Element) {
					this.cur = k1;
					return n;
				}
			}
			return null;
		}};
	}
	,firstElement: function() {
		if(this._children == null) throw "bad nodetype";
		var cur = 0;
		var l = this._children.length;
		while(cur < l) {
			var n = this._children[cur];
			if(n.nodeType == Xml.Element) return n;
			cur++;
		}
		return null;
	}
	,addChild: function(x) {
		if(this._children == null) throw "bad nodetype";
		if(x._parent != null) HxOverrides.remove(x._parent._children,x);
		x._parent = this;
		this._children.push(x);
	}
	,__class__: Xml
	,__properties__: {set_nodeValue:"set_nodeValue",get_nodeValue:"get_nodeValue",set_nodeName:"set_nodeName",get_nodeName:"get_nodeName"}
};
box2D.collision.B2AABB = function() {
	this.lowerBound = new box2D.common.math.B2Vec2();
	this.upperBound = new box2D.common.math.B2Vec2();
};
$hxClasses["box2D.collision.B2AABB"] = box2D.collision.B2AABB;
box2D.collision.B2AABB.__name__ = true;
box2D.collision.B2AABB.prototype = {
	getCenter: function() {
		return new box2D.common.math.B2Vec2((this.lowerBound.x + this.upperBound.x) / 2,(this.lowerBound.y + this.upperBound.y) / 2);
	}
	,contains: function(aabb) {
		var result = true;
		result = result && this.lowerBound.x <= aabb.lowerBound.x;
		result = result && this.lowerBound.y <= aabb.lowerBound.y;
		result = result && aabb.upperBound.x <= this.upperBound.x;
		result = result && aabb.upperBound.y <= this.upperBound.y;
		return result;
	}
	,testOverlap: function(other) {
		var d1X = other.lowerBound.x - this.upperBound.x;
		var d1Y = other.lowerBound.y - this.upperBound.y;
		var d2X = this.lowerBound.x - other.upperBound.x;
		var d2Y = this.lowerBound.y - other.upperBound.y;
		if(d1X > 0.0 || d1Y > 0.0) return false;
		if(d2X > 0.0 || d2Y > 0.0) return false;
		return true;
	}
	,combine: function(aabb1,aabb2) {
		this.lowerBound.x = Math.min(aabb1.lowerBound.x,aabb2.lowerBound.x);
		this.lowerBound.y = Math.min(aabb1.lowerBound.y,aabb2.lowerBound.y);
		this.upperBound.x = Math.max(aabb1.upperBound.x,aabb2.upperBound.x);
		this.upperBound.y = Math.max(aabb1.upperBound.y,aabb2.upperBound.y);
	}
	,__class__: box2D.collision.B2AABB
};
box2D.collision.ClipVertex = function() {
	this.v = new box2D.common.math.B2Vec2();
	this.id = new box2D.collision.B2ContactID();
};
$hxClasses["box2D.collision.ClipVertex"] = box2D.collision.ClipVertex;
box2D.collision.ClipVertex.__name__ = true;
box2D.collision.ClipVertex.prototype = {
	set: function(other) {
		this.v.setV(other.v);
		this.id.set(other.id);
	}
	,__class__: box2D.collision.ClipVertex
};
box2D.collision.B2Collision = function() { };
$hxClasses["box2D.collision.B2Collision"] = box2D.collision.B2Collision;
box2D.collision.B2Collision.__name__ = true;
box2D.collision.B2Collision.clipSegmentToLine = function(vOut,vIn,normal,offset) {
	var cv;
	var numOut = 0;
	cv = vIn[0];
	var vIn0 = cv.v;
	cv = vIn[1];
	var vIn1 = cv.v;
	var distance0 = normal.x * vIn0.x + normal.y * vIn0.y - offset;
	var distance1 = normal.x * vIn1.x + normal.y * vIn1.y - offset;
	if(distance0 <= 0.0) vOut[numOut++].set(vIn[0]);
	if(distance1 <= 0.0) vOut[numOut++].set(vIn[1]);
	if(distance0 * distance1 < 0.0) {
		var interp = distance0 / (distance0 - distance1);
		cv = vOut[numOut];
		var tVec = cv.v;
		tVec.x = vIn0.x + interp * (vIn1.x - vIn0.x);
		tVec.y = vIn0.y + interp * (vIn1.y - vIn0.y);
		cv = vOut[numOut];
		var cv2;
		if(distance0 > 0.0) {
			cv2 = vIn[0];
			cv.id = cv2.id;
		} else {
			cv2 = vIn[1];
			cv.id = cv2.id;
		}
		++numOut;
	}
	return numOut;
};
box2D.collision.B2Collision.edgeSeparation = function(poly1,xf1,edge1,poly2,xf2) {
	var count1 = poly1.m_vertexCount;
	var vertices1 = poly1.m_vertices;
	var normals1 = poly1.m_normals;
	var count2 = poly2.m_vertexCount;
	var vertices2 = poly2.m_vertices;
	var tMat;
	var tVec;
	tMat = xf1.R;
	tVec = normals1[edge1];
	var normal1WorldX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
	var normal1WorldY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
	tMat = xf2.R;
	var normal1X = tMat.col1.x * normal1WorldX + tMat.col1.y * normal1WorldY;
	var normal1Y = tMat.col2.x * normal1WorldX + tMat.col2.y * normal1WorldY;
	var index = 0;
	var minDot = Number.MAX_VALUE;
	var _g = 0;
	while(_g < count2) {
		var i = _g++;
		tVec = vertices2[i];
		var dot = tVec.x * normal1X + tVec.y * normal1Y;
		if(dot < minDot) {
			minDot = dot;
			index = i;
		}
	}
	tVec = vertices1[edge1];
	tMat = xf1.R;
	var v1X = xf1.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
	var v1Y = xf1.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
	tVec = vertices2[index];
	tMat = xf2.R;
	var v2X = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
	var v2Y = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
	v2X -= v1X;
	v2Y -= v1Y;
	var separation = v2X * normal1WorldX + v2Y * normal1WorldY;
	return separation;
};
box2D.collision.B2Collision.findMaxSeparation = function(edgeIndex,poly1,xf1,poly2,xf2) {
	var count1 = poly1.m_vertexCount;
	var normals1 = poly1.m_normals;
	var tVec;
	var tMat;
	tMat = xf2.R;
	tVec = poly2.m_centroid;
	var dX = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
	var dY = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
	tMat = xf1.R;
	tVec = poly1.m_centroid;
	dX -= xf1.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
	dY -= xf1.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
	var dLocal1X = dX * xf1.R.col1.x + dY * xf1.R.col1.y;
	var dLocal1Y = dX * xf1.R.col2.x + dY * xf1.R.col2.y;
	var edge = 0;
	var maxDot = -Number.MAX_VALUE;
	var _g = 0;
	while(_g < count1) {
		var i = _g++;
		tVec = normals1[i];
		var dot = tVec.x * dLocal1X + tVec.y * dLocal1Y;
		if(dot > maxDot) {
			maxDot = dot;
			edge = i;
		}
	}
	var s = box2D.collision.B2Collision.edgeSeparation(poly1,xf1,edge,poly2,xf2);
	var prevEdge;
	if(edge - 1 >= 0) prevEdge = edge - 1; else prevEdge = count1 - 1;
	var sPrev = box2D.collision.B2Collision.edgeSeparation(poly1,xf1,prevEdge,poly2,xf2);
	var nextEdge;
	if(edge + 1 < count1) nextEdge = edge + 1; else nextEdge = 0;
	var sNext = box2D.collision.B2Collision.edgeSeparation(poly1,xf1,nextEdge,poly2,xf2);
	var bestEdge;
	var bestSeparation;
	var increment;
	if(sPrev > s && sPrev > sNext) {
		increment = -1;
		bestEdge = prevEdge;
		bestSeparation = sPrev;
	} else if(sNext > s) {
		increment = 1;
		bestEdge = nextEdge;
		bestSeparation = sNext;
	} else {
		edgeIndex[0] = edge;
		return s;
	}
	while(true) {
		if(increment == -1) if(bestEdge - 1 >= 0) edge = bestEdge - 1; else edge = count1 - 1; else if(bestEdge + 1 < count1) edge = bestEdge + 1; else edge = 0;
		s = box2D.collision.B2Collision.edgeSeparation(poly1,xf1,edge,poly2,xf2);
		if(s > bestSeparation) {
			bestEdge = edge;
			bestSeparation = s;
		} else break;
	}
	edgeIndex[0] = bestEdge;
	return bestSeparation;
};
box2D.collision.B2Collision.findIncidentEdge = function(c,poly1,xf1,edge1,poly2,xf2) {
	var count1 = poly1.m_vertexCount;
	var normals1 = poly1.m_normals;
	var count2 = poly2.m_vertexCount;
	var vertices2 = poly2.m_vertices;
	var normals2 = poly2.m_normals;
	var tMat;
	var tVec;
	tMat = xf1.R;
	tVec = normals1[edge1];
	var normal1X = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
	var normal1Y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
	tMat = xf2.R;
	var tX = tMat.col1.x * normal1X + tMat.col1.y * normal1Y;
	normal1Y = tMat.col2.x * normal1X + tMat.col2.y * normal1Y;
	normal1X = tX;
	var index = 0;
	var minDot = Number.MAX_VALUE;
	var _g = 0;
	while(_g < count2) {
		var i = _g++;
		tVec = normals2[i];
		var dot = normal1X * tVec.x + normal1Y * tVec.y;
		if(dot < minDot) {
			minDot = dot;
			index = i;
		}
	}
	var tClip;
	var i1 = index;
	var i2;
	if(i1 + 1 < count2) i2 = i1 + 1; else i2 = 0;
	tClip = c[0];
	tVec = vertices2[i1];
	tMat = xf2.R;
	tClip.v.x = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
	tClip.v.y = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
	tClip.id.features.set_referenceEdge(edge1);
	tClip.id.features.set_incidentEdge(i1);
	tClip.id.features.set_incidentVertex(0);
	tClip = c[1];
	tVec = vertices2[i2];
	tMat = xf2.R;
	tClip.v.x = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
	tClip.v.y = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
	tClip.id.features.set_referenceEdge(edge1);
	tClip.id.features.set_incidentEdge(i2);
	tClip.id.features.set_incidentVertex(1);
};
box2D.collision.B2Collision.makeClipPointVector = function() {
	var r = new Array();
	r[0] = new box2D.collision.ClipVertex();
	r[1] = new box2D.collision.ClipVertex();
	return r;
};
box2D.collision.B2Collision.collidePolygons = function(manifold,polyA,xfA,polyB,xfB) {
	var cv;
	manifold.m_pointCount = 0;
	var totalRadius = polyA.m_radius + polyB.m_radius;
	var edgeA = 0;
	box2D.collision.B2Collision.s_edgeAO[0] = edgeA;
	var separationA = box2D.collision.B2Collision.findMaxSeparation(box2D.collision.B2Collision.s_edgeAO,polyA,xfA,polyB,xfB);
	edgeA = box2D.collision.B2Collision.s_edgeAO[0];
	if(separationA > totalRadius) return;
	var edgeB = 0;
	box2D.collision.B2Collision.s_edgeBO[0] = edgeB;
	var separationB = box2D.collision.B2Collision.findMaxSeparation(box2D.collision.B2Collision.s_edgeBO,polyB,xfB,polyA,xfA);
	edgeB = box2D.collision.B2Collision.s_edgeBO[0];
	if(separationB > totalRadius) return;
	var poly1;
	var poly2;
	var xf1;
	var xf2;
	var edge1;
	var flip;
	var k_relativeTol = 0.98;
	var k_absoluteTol = 0.001;
	var tMat;
	if(separationB > k_relativeTol * separationA + k_absoluteTol) {
		poly1 = polyB;
		poly2 = polyA;
		xf1 = xfB;
		xf2 = xfA;
		edge1 = edgeB;
		manifold.m_type = box2D.collision.B2ManifoldType.FACE_B;
		flip = 1;
	} else {
		poly1 = polyA;
		poly2 = polyB;
		xf1 = xfA;
		xf2 = xfB;
		edge1 = edgeA;
		manifold.m_type = box2D.collision.B2ManifoldType.FACE_A;
		flip = 0;
	}
	var incidentEdge = box2D.collision.B2Collision.s_incidentEdge;
	box2D.collision.B2Collision.findIncidentEdge(incidentEdge,poly1,xf1,edge1,poly2,xf2);
	var count1 = poly1.m_vertexCount;
	var vertices1 = poly1.m_vertices;
	var local_v11 = vertices1[edge1];
	var local_v12;
	if(edge1 + 1 < count1) local_v12 = vertices1[edge1 + 1 | 0]; else local_v12 = vertices1[0];
	var localTangent = box2D.collision.B2Collision.s_localTangent;
	localTangent.set(local_v12.x - local_v11.x,local_v12.y - local_v11.y);
	localTangent.normalize();
	var localNormal = box2D.collision.B2Collision.s_localNormal;
	localNormal.x = localTangent.y;
	localNormal.y = -localTangent.x;
	var planePoint = box2D.collision.B2Collision.s_planePoint;
	planePoint.set(0.5 * (local_v11.x + local_v12.x),0.5 * (local_v11.y + local_v12.y));
	var tangent = box2D.collision.B2Collision.s_tangent;
	tMat = xf1.R;
	tangent.x = tMat.col1.x * localTangent.x + tMat.col2.x * localTangent.y;
	tangent.y = tMat.col1.y * localTangent.x + tMat.col2.y * localTangent.y;
	var tangent2 = box2D.collision.B2Collision.s_tangent2;
	tangent2.x = -tangent.x;
	tangent2.y = -tangent.y;
	var normal = box2D.collision.B2Collision.s_normal;
	normal.x = tangent.y;
	normal.y = -tangent.x;
	var v11 = box2D.collision.B2Collision.s_v11;
	var v12 = box2D.collision.B2Collision.s_v12;
	v11.x = xf1.position.x + (tMat.col1.x * local_v11.x + tMat.col2.x * local_v11.y);
	v11.y = xf1.position.y + (tMat.col1.y * local_v11.x + tMat.col2.y * local_v11.y);
	v12.x = xf1.position.x + (tMat.col1.x * local_v12.x + tMat.col2.x * local_v12.y);
	v12.y = xf1.position.y + (tMat.col1.y * local_v12.x + tMat.col2.y * local_v12.y);
	var frontOffset = normal.x * v11.x + normal.y * v11.y;
	var sideOffset1 = -tangent.x * v11.x - tangent.y * v11.y + totalRadius;
	var sideOffset2 = tangent.x * v12.x + tangent.y * v12.y + totalRadius;
	var clipPoints1 = box2D.collision.B2Collision.s_clipPoints1;
	var clipPoints2 = box2D.collision.B2Collision.s_clipPoints2;
	var np;
	np = box2D.collision.B2Collision.clipSegmentToLine(clipPoints1,incidentEdge,tangent2,sideOffset1);
	if(np < 2) return;
	np = box2D.collision.B2Collision.clipSegmentToLine(clipPoints2,clipPoints1,tangent,sideOffset2);
	if(np < 2) return;
	manifold.m_localPlaneNormal.setV(localNormal);
	manifold.m_localPoint.setV(planePoint);
	var pointCount = 0;
	var _g1 = 0;
	var _g = box2D.common.B2Settings.b2_maxManifoldPoints;
	while(_g1 < _g) {
		var i = _g1++;
		cv = clipPoints2[i];
		var separation = normal.x * cv.v.x + normal.y * cv.v.y - frontOffset;
		if(separation <= totalRadius) {
			var cp = manifold.m_points[pointCount];
			tMat = xf2.R;
			var tX = cv.v.x - xf2.position.x;
			var tY = cv.v.y - xf2.position.y;
			cp.m_localPoint.x = tX * tMat.col1.x + tY * tMat.col1.y;
			cp.m_localPoint.y = tX * tMat.col2.x + tY * tMat.col2.y;
			cp.m_id.set(cv.id);
			cp.m_id.features.set_flip(flip);
			++pointCount;
		}
	}
	manifold.m_pointCount = pointCount;
};
box2D.collision.B2Collision.collideCircles = function(manifold,circle1,xf1,circle2,xf2) {
	manifold.m_pointCount = 0;
	var tMat;
	var tVec;
	tMat = xf1.R;
	tVec = circle1.m_p;
	var p1X = xf1.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
	var p1Y = xf1.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
	tMat = xf2.R;
	tVec = circle2.m_p;
	var p2X = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
	var p2Y = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
	var dX = p2X - p1X;
	var dY = p2Y - p1Y;
	var distSqr = dX * dX + dY * dY;
	var radius = circle1.m_radius + circle2.m_radius;
	if(distSqr > radius * radius) return;
	manifold.m_type = box2D.collision.B2ManifoldType.CIRCLES;
	manifold.m_localPoint.setV(circle1.m_p);
	manifold.m_localPlaneNormal.setZero();
	manifold.m_pointCount = 1;
	manifold.m_points[0].m_localPoint.setV(circle2.m_p);
	manifold.m_points[0].m_id.set_key(0);
};
box2D.collision.B2Collision.collidePolygonAndCircle = function(manifold,polygon,xf1,circle,xf2) {
	manifold.m_pointCount = 0;
	var tPoint;
	var dX;
	var dY;
	var positionX;
	var positionY;
	var tVec;
	var tMat;
	tMat = xf2.R;
	tVec = circle.m_p;
	var cX = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
	var cY = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
	dX = cX - xf1.position.x;
	dY = cY - xf1.position.y;
	tMat = xf1.R;
	var cLocalX = dX * tMat.col1.x + dY * tMat.col1.y;
	var cLocalY = dX * tMat.col2.x + dY * tMat.col2.y;
	var dist;
	var normalIndex = 0;
	var separation = -Number.MAX_VALUE;
	var radius = polygon.m_radius + circle.m_radius;
	var vertexCount = polygon.m_vertexCount;
	var vertices = polygon.m_vertices;
	var normals = polygon.m_normals;
	var _g = 0;
	while(_g < vertexCount) {
		var i = _g++;
		tVec = vertices[i];
		dX = cLocalX - tVec.x;
		dY = cLocalY - tVec.y;
		tVec = normals[i];
		var s = tVec.x * dX + tVec.y * dY;
		if(s > radius) return;
		if(s > separation) {
			separation = s;
			normalIndex = i;
		}
	}
	var vertIndex1 = normalIndex;
	var vertIndex2;
	if(vertIndex1 + 1 < vertexCount) vertIndex2 = vertIndex1 + 1; else vertIndex2 = 0;
	var v1 = vertices[vertIndex1];
	var v2 = vertices[vertIndex2];
	if(separation < Number.MIN_VALUE) {
		manifold.m_pointCount = 1;
		manifold.m_type = box2D.collision.B2ManifoldType.FACE_A;
		manifold.m_localPlaneNormal.setV(normals[normalIndex]);
		manifold.m_localPoint.x = 0.5 * (v1.x + v2.x);
		manifold.m_localPoint.y = 0.5 * (v1.y + v2.y);
		manifold.m_points[0].m_localPoint.setV(circle.m_p);
		manifold.m_points[0].m_id.set_key(0);
		return;
	}
	var u1 = (cLocalX - v1.x) * (v2.x - v1.x) + (cLocalY - v1.y) * (v2.y - v1.y);
	var u2 = (cLocalX - v2.x) * (v1.x - v2.x) + (cLocalY - v2.y) * (v1.y - v2.y);
	if(u1 <= 0.0) {
		if((cLocalX - v1.x) * (cLocalX - v1.x) + (cLocalY - v1.y) * (cLocalY - v1.y) > radius * radius) return;
		manifold.m_pointCount = 1;
		manifold.m_type = box2D.collision.B2ManifoldType.FACE_A;
		manifold.m_localPlaneNormal.x = cLocalX - v1.x;
		manifold.m_localPlaneNormal.y = cLocalY - v1.y;
		manifold.m_localPlaneNormal.normalize();
		manifold.m_localPoint.setV(v1);
		manifold.m_points[0].m_localPoint.setV(circle.m_p);
		manifold.m_points[0].m_id.set_key(0);
	} else if(u2 <= 0) {
		if((cLocalX - v2.x) * (cLocalX - v2.x) + (cLocalY - v2.y) * (cLocalY - v2.y) > radius * radius) return;
		manifold.m_pointCount = 1;
		manifold.m_type = box2D.collision.B2ManifoldType.FACE_A;
		manifold.m_localPlaneNormal.x = cLocalX - v2.x;
		manifold.m_localPlaneNormal.y = cLocalY - v2.y;
		manifold.m_localPlaneNormal.normalize();
		manifold.m_localPoint.setV(v2);
		manifold.m_points[0].m_localPoint.setV(circle.m_p);
		manifold.m_points[0].m_id.set_key(0);
	} else {
		var faceCenterX = 0.5 * (v1.x + v2.x);
		var faceCenterY = 0.5 * (v1.y + v2.y);
		separation = (cLocalX - faceCenterX) * normals[vertIndex1].x + (cLocalY - faceCenterY) * normals[vertIndex1].y;
		if(separation > radius) return;
		manifold.m_pointCount = 1;
		manifold.m_type = box2D.collision.B2ManifoldType.FACE_A;
		manifold.m_localPlaneNormal.x = normals[vertIndex1].x;
		manifold.m_localPlaneNormal.y = normals[vertIndex1].y;
		manifold.m_localPlaneNormal.normalize();
		manifold.m_localPoint.set(faceCenterX,faceCenterY);
		manifold.m_points[0].m_localPoint.setV(circle.m_p);
		manifold.m_points[0].m_id.set_key(0);
	}
};
box2D.collision.B2Simplex = function() {
	this.m_v1 = new box2D.collision.B2SimplexVertex();
	this.m_v2 = new box2D.collision.B2SimplexVertex();
	this.m_v3 = new box2D.collision.B2SimplexVertex();
	this.m_vertices = new Array();
	this.m_vertices[0] = this.m_v1;
	this.m_vertices[1] = this.m_v2;
	this.m_vertices[2] = this.m_v3;
};
$hxClasses["box2D.collision.B2Simplex"] = box2D.collision.B2Simplex;
box2D.collision.B2Simplex.__name__ = true;
box2D.collision.B2Simplex.prototype = {
	readCache: function(cache,proxyA,transformA,proxyB,transformB) {
		box2D.common.B2Settings.b2Assert(0 <= cache.count && cache.count <= 3);
		var wALocal;
		var wBLocal;
		this.m_count = cache.count;
		var vertices = this.m_vertices;
		var v;
		var _g1 = 0;
		var _g = this.m_count;
		while(_g1 < _g) {
			var i = _g1++;
			v = vertices[i];
			v.indexA = cache.indexA[i];
			v.indexB = cache.indexB[i];
			wALocal = proxyA.getVertex(v.indexA);
			wBLocal = proxyB.getVertex(v.indexB);
			v.wA = box2D.common.math.B2Math.mulX(transformA,wALocal);
			v.wB = box2D.common.math.B2Math.mulX(transformB,wBLocal);
			v.w = box2D.common.math.B2Math.subtractVV(v.wB,v.wA);
			v.a = 0;
		}
		if(this.m_count > 1) {
			var metric1 = cache.metric;
			var metric2 = this.getMetric();
			if(metric2 < .5 * metric1 || 2.0 * metric1 < metric2 || metric2 < Number.MIN_VALUE) this.m_count = 0;
		}
		if(this.m_count == 0) {
			v = vertices[0];
			v.indexA = 0;
			v.indexB = 0;
			wALocal = proxyA.getVertex(0);
			wBLocal = proxyB.getVertex(0);
			v.wA = box2D.common.math.B2Math.mulX(transformA,wALocal);
			v.wB = box2D.common.math.B2Math.mulX(transformB,wBLocal);
			v.w = box2D.common.math.B2Math.subtractVV(v.wB,v.wA);
			this.m_count = 1;
		}
	}
	,writeCache: function(cache) {
		cache.metric = this.getMetric();
		cache.count = this.m_count | 0;
		var vertices = this.m_vertices;
		var _g1 = 0;
		var _g = this.m_count;
		while(_g1 < _g) {
			var i = _g1++;
			cache.indexA[i] = vertices[i].indexA | 0;
			cache.indexB[i] = vertices[i].indexB | 0;
		}
	}
	,getSearchDirection: function() {
		var _g = this.m_count;
		switch(_g) {
		case 1:
			return this.m_v1.w.getNegative();
		case 2:
			var e12 = box2D.common.math.B2Math.subtractVV(this.m_v2.w,this.m_v1.w);
			var sgn = box2D.common.math.B2Math.crossVV(e12,this.m_v1.w.getNegative());
			if(sgn > 0.0) return box2D.common.math.B2Math.crossFV(1.0,e12); else return box2D.common.math.B2Math.crossVF(e12,1.0);
			break;
		default:
			box2D.common.B2Settings.b2Assert(false);
			return new box2D.common.math.B2Vec2();
		}
	}
	,getClosestPoint: function() {
		var _g = this.m_count;
		switch(_g) {
		case 0:
			box2D.common.B2Settings.b2Assert(false);
			return new box2D.common.math.B2Vec2();
		case 1:
			return this.m_v1.w;
		case 2:
			return new box2D.common.math.B2Vec2(this.m_v1.a * this.m_v1.w.x + this.m_v2.a * this.m_v2.w.x,this.m_v1.a * this.m_v1.w.y + this.m_v2.a * this.m_v2.w.y);
		default:
			box2D.common.B2Settings.b2Assert(false);
			return new box2D.common.math.B2Vec2();
		}
	}
	,getWitnessPoints: function(pA,pB) {
		var _g = this.m_count;
		switch(_g) {
		case 0:
			box2D.common.B2Settings.b2Assert(false);
			break;
		case 1:
			pA.setV(this.m_v1.wA);
			pB.setV(this.m_v1.wB);
			break;
		case 2:
			pA.x = this.m_v1.a * this.m_v1.wA.x + this.m_v2.a * this.m_v2.wA.x;
			pA.y = this.m_v1.a * this.m_v1.wA.y + this.m_v2.a * this.m_v2.wA.y;
			pB.x = this.m_v1.a * this.m_v1.wB.x + this.m_v2.a * this.m_v2.wB.x;
			pB.y = this.m_v1.a * this.m_v1.wB.y + this.m_v2.a * this.m_v2.wB.y;
			break;
		case 3:
			pB.x = pA.x = this.m_v1.a * this.m_v1.wA.x + this.m_v2.a * this.m_v2.wA.x + this.m_v3.a * this.m_v3.wA.x;
			pB.y = pA.y = this.m_v1.a * this.m_v1.wA.y + this.m_v2.a * this.m_v2.wA.y + this.m_v3.a * this.m_v3.wA.y;
			break;
		default:
			box2D.common.B2Settings.b2Assert(false);
		}
	}
	,getMetric: function() {
		var _g = this.m_count;
		switch(_g) {
		case 0:
			box2D.common.B2Settings.b2Assert(false);
			return 0.0;
		case 1:
			return 0.0;
		case 2:
			return box2D.common.math.B2Math.subtractVV(this.m_v1.w,this.m_v2.w).length();
		case 3:
			return box2D.common.math.B2Math.crossVV(box2D.common.math.B2Math.subtractVV(this.m_v2.w,this.m_v1.w),box2D.common.math.B2Math.subtractVV(this.m_v3.w,this.m_v1.w));
		default:
			box2D.common.B2Settings.b2Assert(false);
			return 0.0;
		}
	}
	,solve2: function() {
		var w1 = this.m_v1.w;
		var w2 = this.m_v2.w;
		var e12 = box2D.common.math.B2Math.subtractVV(w2,w1);
		var d12_2 = -(w1.x * e12.x + w1.y * e12.y);
		if(d12_2 <= 0.0) {
			this.m_v1.a = 1.0;
			this.m_count = 1;
			return;
		}
		var d12_1 = w2.x * e12.x + w2.y * e12.y;
		if(d12_1 <= 0.0) {
			this.m_v2.a = 1.0;
			this.m_count = 1;
			this.m_v1.set(this.m_v2);
			return;
		}
		var inv_d12 = 1.0 / (d12_1 + d12_2);
		this.m_v1.a = d12_1 * inv_d12;
		this.m_v2.a = d12_2 * inv_d12;
		this.m_count = 2;
	}
	,solve3: function() {
		var w1 = this.m_v1.w;
		var w2 = this.m_v2.w;
		var w3 = this.m_v3.w;
		var e12 = box2D.common.math.B2Math.subtractVV(w2,w1);
		var w1e12 = box2D.common.math.B2Math.dot(w1,e12);
		var w2e12 = box2D.common.math.B2Math.dot(w2,e12);
		var d12_1 = w2e12;
		var d12_2 = -w1e12;
		var e13 = box2D.common.math.B2Math.subtractVV(w3,w1);
		var w1e13 = box2D.common.math.B2Math.dot(w1,e13);
		var w3e13 = box2D.common.math.B2Math.dot(w3,e13);
		var d13_1 = w3e13;
		var d13_2 = -w1e13;
		var e23 = box2D.common.math.B2Math.subtractVV(w3,w2);
		var w2e23 = box2D.common.math.B2Math.dot(w2,e23);
		var w3e23 = box2D.common.math.B2Math.dot(w3,e23);
		var d23_1 = w3e23;
		var d23_2 = -w2e23;
		var n123 = box2D.common.math.B2Math.crossVV(e12,e13);
		var d123_1 = n123 * box2D.common.math.B2Math.crossVV(w2,w3);
		var d123_2 = n123 * box2D.common.math.B2Math.crossVV(w3,w1);
		var d123_3 = n123 * box2D.common.math.B2Math.crossVV(w1,w2);
		if(d12_2 <= 0.0 && d13_2 <= 0.0) {
			this.m_v1.a = 1.0;
			this.m_count = 1;
			return;
		}
		if(d12_1 > 0.0 && d12_2 > 0.0 && d123_3 <= 0.0) {
			var inv_d12 = 1.0 / (d12_1 + d12_2);
			this.m_v1.a = d12_1 * inv_d12;
			this.m_v2.a = d12_2 * inv_d12;
			this.m_count = 2;
			return;
		}
		if(d13_1 > 0.0 && d13_2 > 0.0 && d123_2 <= 0.0) {
			var inv_d13 = 1.0 / (d13_1 + d13_2);
			this.m_v1.a = d13_1 * inv_d13;
			this.m_v3.a = d13_2 * inv_d13;
			this.m_count = 2;
			this.m_v2.set(this.m_v3);
			return;
		}
		if(d12_1 <= 0.0 && d23_2 <= 0.0) {
			this.m_v2.a = 1.0;
			this.m_count = 1;
			this.m_v1.set(this.m_v2);
			return;
		}
		if(d13_1 <= 0.0 && d23_1 <= 0.0) {
			this.m_v3.a = 1.0;
			this.m_count = 1;
			this.m_v1.set(this.m_v3);
			return;
		}
		if(d23_1 > 0.0 && d23_2 > 0.0 && d123_1 <= 0.0) {
			var inv_d23 = 1.0 / (d23_1 + d23_2);
			this.m_v2.a = d23_1 * inv_d23;
			this.m_v3.a = d23_2 * inv_d23;
			this.m_count = 2;
			this.m_v1.set(this.m_v3);
			return;
		}
		var inv_d123 = 1.0 / (d123_1 + d123_2 + d123_3);
		this.m_v1.a = d123_1 * inv_d123;
		this.m_v2.a = d123_2 * inv_d123;
		this.m_v3.a = d123_3 * inv_d123;
		this.m_count = 3;
	}
	,__class__: box2D.collision.B2Simplex
};
box2D.collision.B2SimplexVertex = function() {
};
$hxClasses["box2D.collision.B2SimplexVertex"] = box2D.collision.B2SimplexVertex;
box2D.collision.B2SimplexVertex.__name__ = true;
box2D.collision.B2SimplexVertex.prototype = {
	set: function(other) {
		this.wA.setV(other.wA);
		this.wB.setV(other.wB);
		this.w.setV(other.w);
		this.a = other.a;
		this.indexA = other.indexA;
		this.indexB = other.indexB;
	}
	,__class__: box2D.collision.B2SimplexVertex
};
box2D.collision.B2Distance = function() { };
$hxClasses["box2D.collision.B2Distance"] = box2D.collision.B2Distance;
box2D.collision.B2Distance.__name__ = true;
box2D.collision.B2Distance.distance = function(output,cache,input) {
	++box2D.collision.B2Distance.b2_gjkCalls;
	var proxyA = input.proxyA;
	var proxyB = input.proxyB;
	var transformA = input.transformA;
	var transformB = input.transformB;
	var simplex = box2D.collision.B2Distance.s_simplex;
	simplex.readCache(cache,proxyA,transformA,proxyB,transformB);
	var vertices = simplex.m_vertices;
	var k_maxIters = 20;
	var saveA = box2D.collision.B2Distance.s_saveA;
	var saveB = box2D.collision.B2Distance.s_saveB;
	var saveCount = 0;
	var closestPoint = simplex.getClosestPoint();
	var distanceSqr1 = closestPoint.lengthSquared();
	var distanceSqr2 = distanceSqr1;
	var i;
	var p;
	var iter = 0;
	while(iter < k_maxIters) {
		saveCount = simplex.m_count;
		var _g = 0;
		while(_g < saveCount) {
			var i1 = _g++;
			saveA[i1] = vertices[i1].indexA;
			saveB[i1] = vertices[i1].indexB;
		}
		var _g1 = simplex.m_count;
		switch(_g1) {
		case 1:
			break;
		case 2:
			simplex.solve2();
			break;
		case 3:
			simplex.solve3();
			break;
		default:
			box2D.common.B2Settings.b2Assert(false);
		}
		if(simplex.m_count == 3) break;
		p = simplex.getClosestPoint();
		distanceSqr2 = p.lengthSquared();
		if(distanceSqr2 > distanceSqr1) {
		}
		distanceSqr1 = distanceSqr2;
		var d = simplex.getSearchDirection();
		if(d.lengthSquared() < Number.MIN_VALUE * Number.MIN_VALUE) break;
		var vertex = vertices[simplex.m_count];
		vertex.indexA = Std["int"](proxyA.getSupport(box2D.common.math.B2Math.mulTMV(transformA.R,d.getNegative())));
		vertex.wA = box2D.common.math.B2Math.mulX(transformA,proxyA.getVertex(vertex.indexA));
		vertex.indexB = Std["int"](proxyB.getSupport(box2D.common.math.B2Math.mulTMV(transformB.R,d)));
		vertex.wB = box2D.common.math.B2Math.mulX(transformB,proxyB.getVertex(vertex.indexB));
		vertex.w = box2D.common.math.B2Math.subtractVV(vertex.wB,vertex.wA);
		++iter;
		++box2D.collision.B2Distance.b2_gjkIters;
		var duplicate = false;
		var _g2 = 0;
		while(_g2 < saveCount) {
			var i2 = _g2++;
			if(vertex.indexA == saveA[i2] && vertex.indexB == saveB[i2]) {
				duplicate = true;
				break;
			}
		}
		if(duplicate) break;
		++simplex.m_count;
	}
	box2D.collision.B2Distance.b2_gjkMaxIters = Std["int"](box2D.common.math.B2Math.max(box2D.collision.B2Distance.b2_gjkMaxIters,iter));
	simplex.getWitnessPoints(output.pointA,output.pointB);
	output.distance = box2D.common.math.B2Math.subtractVV(output.pointA,output.pointB).length();
	output.iterations = iter;
	simplex.writeCache(cache);
	if(input.useRadii) {
		var rA = proxyA.m_radius;
		var rB = proxyB.m_radius;
		if(output.distance > rA + rB && output.distance > Number.MIN_VALUE) {
			output.distance -= rA + rB;
			var normal = box2D.common.math.B2Math.subtractVV(output.pointB,output.pointA);
			normal.normalize();
			output.pointA.x += rA * normal.x;
			output.pointA.y += rA * normal.y;
			output.pointB.x -= rB * normal.x;
			output.pointB.y -= rB * normal.y;
		} else {
			p = new box2D.common.math.B2Vec2();
			p.x = .5 * (output.pointA.x + output.pointB.x);
			p.y = .5 * (output.pointA.y + output.pointB.y);
			output.pointA.x = output.pointB.x = p.x;
			output.pointA.y = output.pointB.y = p.y;
			output.distance = 0.0;
		}
	}
};
box2D.collision.B2DistanceInput = function() {
};
$hxClasses["box2D.collision.B2DistanceInput"] = box2D.collision.B2DistanceInput;
box2D.collision.B2DistanceInput.__name__ = true;
box2D.collision.B2DistanceInput.prototype = {
	__class__: box2D.collision.B2DistanceInput
};
box2D.collision.B2DistanceOutput = function() {
	this.pointA = new box2D.common.math.B2Vec2();
	this.pointB = new box2D.common.math.B2Vec2();
};
$hxClasses["box2D.collision.B2DistanceOutput"] = box2D.collision.B2DistanceOutput;
box2D.collision.B2DistanceOutput.__name__ = true;
box2D.collision.B2DistanceOutput.prototype = {
	__class__: box2D.collision.B2DistanceOutput
};
box2D.collision.B2DistanceProxy = function() {
	this.m_vertices = new Array();
};
$hxClasses["box2D.collision.B2DistanceProxy"] = box2D.collision.B2DistanceProxy;
box2D.collision.B2DistanceProxy.__name__ = true;
box2D.collision.B2DistanceProxy.prototype = {
	set: function(shape) {
		var _g = shape.getType();
		switch(_g[1]) {
		case 1:
			var circle;
			circle = js.Boot.__cast(shape , box2D.collision.shapes.B2CircleShape);
			this.m_vertices = new Array();
			this.m_vertices[0] = circle.m_p;
			this.m_count = 1;
			this.m_radius = circle.m_radius;
			break;
		case 2:
			var polygon;
			polygon = js.Boot.__cast(shape , box2D.collision.shapes.B2PolygonShape);
			this.m_vertices = polygon.m_vertices;
			this.m_count = polygon.m_vertexCount;
			this.m_radius = polygon.m_radius;
			break;
		default:
			box2D.common.B2Settings.b2Assert(false);
		}
	}
	,getSupport: function(d) {
		var bestIndex = 0;
		var bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
		var _g1 = 1;
		var _g = this.m_count;
		while(_g1 < _g) {
			var i = _g1++;
			var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
			if(value > bestValue) {
				bestIndex = i;
				bestValue = value;
			}
		}
		return bestIndex;
	}
	,getSupportVertex: function(d) {
		var bestIndex = 0;
		var bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
		var _g1 = 1;
		var _g = this.m_count;
		while(_g1 < _g) {
			var i = _g1++;
			var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
			if(value > bestValue) {
				bestIndex = i;
				bestValue = value;
			}
		}
		return this.m_vertices[bestIndex];
	}
	,getVertex: function(index) {
		box2D.common.B2Settings.b2Assert(0 <= index && index < this.m_count);
		return this.m_vertices[index];
	}
	,__class__: box2D.collision.B2DistanceProxy
};
box2D.collision.B2DynamicTreeNode = function() {
	this.aabb = new box2D.collision.B2AABB();
	this.id = box2D.collision.B2DynamicTreeNode.currentID++;
};
$hxClasses["box2D.collision.B2DynamicTreeNode"] = box2D.collision.B2DynamicTreeNode;
box2D.collision.B2DynamicTreeNode.__name__ = true;
box2D.collision.B2DynamicTreeNode.prototype = {
	isLeaf: function() {
		return this.child1 == null;
	}
	,__class__: box2D.collision.B2DynamicTreeNode
};
box2D.collision.B2DynamicTreePair = function() {
};
$hxClasses["box2D.collision.B2DynamicTreePair"] = box2D.collision.B2DynamicTreePair;
box2D.collision.B2DynamicTreePair.__name__ = true;
box2D.collision.B2DynamicTreePair.prototype = {
	__class__: box2D.collision.B2DynamicTreePair
};
box2D.collision.B2Manifold = function() {
	this.m_pointCount = 0;
	this.m_points = new Array();
	var _g1 = 0;
	var _g = box2D.common.B2Settings.b2_maxManifoldPoints;
	while(_g1 < _g) {
		var i = _g1++;
		this.m_points[i] = new box2D.collision.B2ManifoldPoint();
	}
	this.m_localPlaneNormal = new box2D.common.math.B2Vec2();
	this.m_localPoint = new box2D.common.math.B2Vec2();
};
$hxClasses["box2D.collision.B2Manifold"] = box2D.collision.B2Manifold;
box2D.collision.B2Manifold.__name__ = true;
box2D.collision.B2Manifold.prototype = {
	__class__: box2D.collision.B2Manifold
};
box2D.collision.B2ManifoldPoint = function() {
	this.m_localPoint = new box2D.common.math.B2Vec2();
	this.m_id = new box2D.collision.B2ContactID();
	this.reset();
};
$hxClasses["box2D.collision.B2ManifoldPoint"] = box2D.collision.B2ManifoldPoint;
box2D.collision.B2ManifoldPoint.__name__ = true;
box2D.collision.B2ManifoldPoint.prototype = {
	reset: function() {
		this.m_localPoint.setZero();
		this.m_normalImpulse = 0.0;
		this.m_tangentImpulse = 0.0;
		this.m_id.set_key(0);
	}
	,__class__: box2D.collision.B2ManifoldPoint
};
box2D.collision.B2ManifoldType = $hxClasses["box2D.collision.B2ManifoldType"] = { __ename__ : true, __constructs__ : ["CIRCLES","FACE_A","FACE_B"] };
box2D.collision.B2ManifoldType.CIRCLES = ["CIRCLES",0];
box2D.collision.B2ManifoldType.CIRCLES.toString = $estr;
box2D.collision.B2ManifoldType.CIRCLES.__enum__ = box2D.collision.B2ManifoldType;
box2D.collision.B2ManifoldType.FACE_A = ["FACE_A",1];
box2D.collision.B2ManifoldType.FACE_A.toString = $estr;
box2D.collision.B2ManifoldType.FACE_A.__enum__ = box2D.collision.B2ManifoldType;
box2D.collision.B2ManifoldType.FACE_B = ["FACE_B",2];
box2D.collision.B2ManifoldType.FACE_B.toString = $estr;
box2D.collision.B2ManifoldType.FACE_B.__enum__ = box2D.collision.B2ManifoldType;
box2D.collision.B2ManifoldType.__empty_constructs__ = [box2D.collision.B2ManifoldType.CIRCLES,box2D.collision.B2ManifoldType.FACE_A,box2D.collision.B2ManifoldType.FACE_B];
box2D.collision.B2SeparationFunction = function() {
	this.m_localPoint = new box2D.common.math.B2Vec2();
	this.m_axis = new box2D.common.math.B2Vec2();
};
$hxClasses["box2D.collision.B2SeparationFunction"] = box2D.collision.B2SeparationFunction;
box2D.collision.B2SeparationFunction.__name__ = true;
box2D.collision.B2SeparationFunction.prototype = {
	initialize: function(cache,proxyA,transformA,proxyB,transformB) {
		this.m_proxyA = proxyA;
		this.m_proxyB = proxyB;
		var count = cache.count;
		box2D.common.B2Settings.b2Assert(0 < count && count < 3);
		var localPointA = new box2D.common.math.B2Vec2();
		var localPointA1;
		var localPointA2;
		var localPointB = new box2D.common.math.B2Vec2();
		var localPointB1;
		var localPointB2;
		var pointAX;
		var pointAY;
		var pointBX;
		var pointBY;
		var normalX;
		var normalY;
		var tMat;
		var tVec;
		var s;
		var sgn;
		if(count == 1) {
			this.m_type = box2D.collision.B2SeparationFunctionType.POINTS;
			localPointA = this.m_proxyA.getVertex(cache.indexA[0]);
			localPointB = this.m_proxyB.getVertex(cache.indexB[0]);
			tVec = localPointA;
			tMat = transformA.R;
			pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
			pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
			tVec = localPointB;
			tMat = transformB.R;
			pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
			pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
			this.m_axis.x = pointBX - pointAX;
			this.m_axis.y = pointBY - pointAY;
			this.m_axis.normalize();
		} else if(cache.indexB[0] == cache.indexB[1]) {
			this.m_type = box2D.collision.B2SeparationFunctionType.FACE_A;
			localPointA1 = this.m_proxyA.getVertex(cache.indexA[0]);
			localPointA2 = this.m_proxyA.getVertex(cache.indexA[1]);
			localPointB = this.m_proxyB.getVertex(cache.indexB[0]);
			this.m_localPoint.x = 0.5 * (localPointA1.x + localPointA2.x);
			this.m_localPoint.y = 0.5 * (localPointA1.y + localPointA2.y);
			this.m_axis = box2D.common.math.B2Math.crossVF(box2D.common.math.B2Math.subtractVV(localPointA2,localPointA1),1.0);
			this.m_axis.normalize();
			tVec = this.m_axis;
			tMat = transformA.R;
			normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
			normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
			tVec = this.m_localPoint;
			tMat = transformA.R;
			pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
			pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
			tVec = localPointB;
			tMat = transformB.R;
			pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
			pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
			s = (pointBX - pointAX) * normalX + (pointBY - pointAY) * normalY;
			if(s < 0.0) this.m_axis.negativeSelf();
		} else if(cache.indexA[0] == cache.indexA[0]) {
			this.m_type = box2D.collision.B2SeparationFunctionType.FACE_B;
			localPointB1 = this.m_proxyB.getVertex(cache.indexB[0]);
			localPointB2 = this.m_proxyB.getVertex(cache.indexB[1]);
			localPointA = this.m_proxyA.getVertex(cache.indexA[0]);
			this.m_localPoint.x = 0.5 * (localPointB1.x + localPointB2.x);
			this.m_localPoint.y = 0.5 * (localPointB1.y + localPointB2.y);
			this.m_axis = box2D.common.math.B2Math.crossVF(box2D.common.math.B2Math.subtractVV(localPointB2,localPointB1),1.0);
			this.m_axis.normalize();
			tVec = this.m_axis;
			tMat = transformB.R;
			normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
			normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
			tVec = this.m_localPoint;
			tMat = transformB.R;
			pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
			pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
			tVec = localPointA;
			tMat = transformA.R;
			pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
			pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
			s = (pointAX - pointBX) * normalX + (pointAY - pointBY) * normalY;
			if(s < 0.0) this.m_axis.negativeSelf();
		} else {
			localPointA1 = this.m_proxyA.getVertex(cache.indexA[0]);
			localPointA2 = this.m_proxyA.getVertex(cache.indexA[1]);
			localPointB1 = this.m_proxyB.getVertex(cache.indexB[0]);
			localPointB2 = this.m_proxyB.getVertex(cache.indexB[1]);
			var pA = box2D.common.math.B2Math.mulX(transformA,localPointA);
			var dA = box2D.common.math.B2Math.mulMV(transformA.R,box2D.common.math.B2Math.subtractVV(localPointA2,localPointA1));
			var pB = box2D.common.math.B2Math.mulX(transformB,localPointB);
			var dB = box2D.common.math.B2Math.mulMV(transformB.R,box2D.common.math.B2Math.subtractVV(localPointB2,localPointB1));
			var a = dA.x * dA.x + dA.y * dA.y;
			var e = dB.x * dB.x + dB.y * dB.y;
			var r = box2D.common.math.B2Math.subtractVV(dB,dA);
			var c = dA.x * r.x + dA.y * r.y;
			var f = dB.x * r.x + dB.y * r.y;
			var b = dA.x * dB.x + dA.y * dB.y;
			var denom = a * e - b * b;
			s = 0.0;
			if(denom != 0.0) s = box2D.common.math.B2Math.clamp((b * f - c * e) / denom,0.0,1.0);
			var t = (b * s + f) / e;
			if(t < 0.0) {
				t = 0.0;
				s = box2D.common.math.B2Math.clamp((b - c) / a,0.0,1.0);
			}
			localPointA = new box2D.common.math.B2Vec2();
			localPointA.x = localPointA1.x + s * (localPointA2.x - localPointA1.x);
			localPointA.y = localPointA1.y + s * (localPointA2.y - localPointA1.y);
			localPointB = new box2D.common.math.B2Vec2();
			localPointB.x = localPointB1.x + s * (localPointB2.x - localPointB1.x);
			localPointB.y = localPointB1.y + s * (localPointB2.y - localPointB1.y);
			if(s == 0.0 || s == 1.0) {
				this.m_type = box2D.collision.B2SeparationFunctionType.FACE_B;
				this.m_axis = box2D.common.math.B2Math.crossVF(box2D.common.math.B2Math.subtractVV(localPointB2,localPointB1),1.0);
				this.m_axis.normalize();
				this.m_localPoint = localPointB;
				tVec = this.m_axis;
				tMat = transformB.R;
				normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
				normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
				tVec = this.m_localPoint;
				tMat = transformB.R;
				pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
				pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
				tVec = localPointA;
				tMat = transformA.R;
				pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
				pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
				sgn = (pointAX - pointBX) * normalX + (pointAY - pointBY) * normalY;
				if(s < 0.0) this.m_axis.negativeSelf();
			} else {
				this.m_type = box2D.collision.B2SeparationFunctionType.FACE_A;
				this.m_axis = box2D.common.math.B2Math.crossVF(box2D.common.math.B2Math.subtractVV(localPointA2,localPointA1),1.0);
				this.m_localPoint = localPointA;
				tVec = this.m_axis;
				tMat = transformA.R;
				normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
				normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
				tVec = this.m_localPoint;
				tMat = transformA.R;
				pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
				pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
				tVec = localPointB;
				tMat = transformB.R;
				pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
				pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
				sgn = (pointBX - pointAX) * normalX + (pointBY - pointAY) * normalY;
				if(s < 0.0) this.m_axis.negativeSelf();
			}
		}
	}
	,evaluate: function(transformA,transformB) {
		var axisA;
		var axisB;
		var localPointA;
		var localPointB;
		var pointA;
		var pointB;
		var seperation;
		var normal;
		var _g = this.m_type;
		switch(_g[1]) {
		case 0:
			axisA = box2D.common.math.B2Math.mulTMV(transformA.R,this.m_axis);
			axisB = box2D.common.math.B2Math.mulTMV(transformB.R,this.m_axis.getNegative());
			localPointA = this.m_proxyA.getSupportVertex(axisA);
			localPointB = this.m_proxyB.getSupportVertex(axisB);
			pointA = box2D.common.math.B2Math.mulX(transformA,localPointA);
			pointB = box2D.common.math.B2Math.mulX(transformB,localPointB);
			seperation = (pointB.x - pointA.x) * this.m_axis.x + (pointB.y - pointA.y) * this.m_axis.y;
			return seperation;
		case 1:
			normal = box2D.common.math.B2Math.mulMV(transformA.R,this.m_axis);
			pointA = box2D.common.math.B2Math.mulX(transformA,this.m_localPoint);
			axisB = box2D.common.math.B2Math.mulTMV(transformB.R,normal.getNegative());
			localPointB = this.m_proxyB.getSupportVertex(axisB);
			pointB = box2D.common.math.B2Math.mulX(transformB,localPointB);
			seperation = (pointB.x - pointA.x) * normal.x + (pointB.y - pointA.y) * normal.y;
			return seperation;
		case 2:
			normal = box2D.common.math.B2Math.mulMV(transformB.R,this.m_axis);
			pointB = box2D.common.math.B2Math.mulX(transformB,this.m_localPoint);
			axisA = box2D.common.math.B2Math.mulTMV(transformA.R,normal.getNegative());
			localPointA = this.m_proxyA.getSupportVertex(axisA);
			pointA = box2D.common.math.B2Math.mulX(transformA,localPointA);
			seperation = (pointA.x - pointB.x) * normal.x + (pointA.y - pointB.y) * normal.y;
			return seperation;
		}
	}
	,__class__: box2D.collision.B2SeparationFunction
};
box2D.collision.B2SeparationFunctionType = $hxClasses["box2D.collision.B2SeparationFunctionType"] = { __ename__ : true, __constructs__ : ["POINTS","FACE_A","FACE_B"] };
box2D.collision.B2SeparationFunctionType.POINTS = ["POINTS",0];
box2D.collision.B2SeparationFunctionType.POINTS.toString = $estr;
box2D.collision.B2SeparationFunctionType.POINTS.__enum__ = box2D.collision.B2SeparationFunctionType;
box2D.collision.B2SeparationFunctionType.FACE_A = ["FACE_A",1];
box2D.collision.B2SeparationFunctionType.FACE_A.toString = $estr;
box2D.collision.B2SeparationFunctionType.FACE_A.__enum__ = box2D.collision.B2SeparationFunctionType;
box2D.collision.B2SeparationFunctionType.FACE_B = ["FACE_B",2];
box2D.collision.B2SeparationFunctionType.FACE_B.toString = $estr;
box2D.collision.B2SeparationFunctionType.FACE_B.__enum__ = box2D.collision.B2SeparationFunctionType;
box2D.collision.B2SeparationFunctionType.__empty_constructs__ = [box2D.collision.B2SeparationFunctionType.POINTS,box2D.collision.B2SeparationFunctionType.FACE_A,box2D.collision.B2SeparationFunctionType.FACE_B];
box2D.collision.B2SimplexCache = function() {
	this.indexA = new Array();
	this.indexB = new Array();
};
$hxClasses["box2D.collision.B2SimplexCache"] = box2D.collision.B2SimplexCache;
box2D.collision.B2SimplexCache.__name__ = true;
box2D.collision.B2SimplexCache.prototype = {
	__class__: box2D.collision.B2SimplexCache
};
box2D.collision.B2TOIInput = function() {
	this.proxyA = new box2D.collision.B2DistanceProxy();
	this.proxyB = new box2D.collision.B2DistanceProxy();
	this.sweepA = new box2D.common.math.B2Sweep();
	this.sweepB = new box2D.common.math.B2Sweep();
};
$hxClasses["box2D.collision.B2TOIInput"] = box2D.collision.B2TOIInput;
box2D.collision.B2TOIInput.__name__ = true;
box2D.collision.B2TOIInput.prototype = {
	__class__: box2D.collision.B2TOIInput
};
box2D.collision.B2TimeOfImpact = function() { };
$hxClasses["box2D.collision.B2TimeOfImpact"] = box2D.collision.B2TimeOfImpact;
box2D.collision.B2TimeOfImpact.__name__ = true;
box2D.collision.B2TimeOfImpact.timeOfImpact = function(input) {
	++box2D.collision.B2TimeOfImpact.b2_toiCalls;
	var proxyA = input.proxyA;
	var proxyB = input.proxyB;
	var sweepA = input.sweepA;
	var sweepB = input.sweepB;
	box2D.common.B2Settings.b2Assert(sweepA.t0 == sweepB.t0);
	box2D.common.B2Settings.b2Assert(1.0 - sweepA.t0 > Number.MIN_VALUE);
	var radius = proxyA.m_radius + proxyB.m_radius;
	var tolerance = input.tolerance;
	var alpha = 0.0;
	var k_maxIterations = 1000;
	var iter = 0;
	var target = 0.0;
	box2D.collision.B2TimeOfImpact.s_cache.count = 0;
	box2D.collision.B2TimeOfImpact.s_distanceInput.useRadii = false;
	while(true) {
		sweepA.getTransform(box2D.collision.B2TimeOfImpact.s_xfA,alpha);
		sweepB.getTransform(box2D.collision.B2TimeOfImpact.s_xfB,alpha);
		box2D.collision.B2TimeOfImpact.s_distanceInput.proxyA = proxyA;
		box2D.collision.B2TimeOfImpact.s_distanceInput.proxyB = proxyB;
		box2D.collision.B2TimeOfImpact.s_distanceInput.transformA = box2D.collision.B2TimeOfImpact.s_xfA;
		box2D.collision.B2TimeOfImpact.s_distanceInput.transformB = box2D.collision.B2TimeOfImpact.s_xfB;
		box2D.collision.B2Distance.distance(box2D.collision.B2TimeOfImpact.s_distanceOutput,box2D.collision.B2TimeOfImpact.s_cache,box2D.collision.B2TimeOfImpact.s_distanceInput);
		if(box2D.collision.B2TimeOfImpact.s_distanceOutput.distance <= 0.0) {
			alpha = 1.0;
			break;
		}
		box2D.collision.B2TimeOfImpact.s_fcn.initialize(box2D.collision.B2TimeOfImpact.s_cache,proxyA,box2D.collision.B2TimeOfImpact.s_xfA,proxyB,box2D.collision.B2TimeOfImpact.s_xfB);
		var separation = box2D.collision.B2TimeOfImpact.s_fcn.evaluate(box2D.collision.B2TimeOfImpact.s_xfA,box2D.collision.B2TimeOfImpact.s_xfB);
		if(separation <= 0.0) {
			alpha = 1.0;
			break;
		}
		if(iter == 0) {
			if(separation > radius) target = box2D.common.math.B2Math.max(radius - tolerance,0.75 * radius); else target = box2D.common.math.B2Math.max(separation - tolerance,0.02 * radius);
		}
		if(separation - target < 0.5 * tolerance) {
			if(iter == 0) {
				alpha = 1.0;
				break;
			}
			break;
		}
		var newAlpha = alpha;
		var x1 = alpha;
		var x2 = 1.0;
		var f1 = separation;
		sweepA.getTransform(box2D.collision.B2TimeOfImpact.s_xfA,x2);
		sweepB.getTransform(box2D.collision.B2TimeOfImpact.s_xfB,x2);
		var f2 = box2D.collision.B2TimeOfImpact.s_fcn.evaluate(box2D.collision.B2TimeOfImpact.s_xfA,box2D.collision.B2TimeOfImpact.s_xfB);
		if(f2 >= target) {
			alpha = 1.0;
			break;
		}
		var rootIterCount = 0;
		while(true) {
			var x;
			if((rootIterCount & 1) != 0) x = x1 + (target - f1) * (x2 - x1) / (f2 - f1); else x = 0.5 * (x1 + x2);
			sweepA.getTransform(box2D.collision.B2TimeOfImpact.s_xfA,x);
			sweepB.getTransform(box2D.collision.B2TimeOfImpact.s_xfB,x);
			var f = box2D.collision.B2TimeOfImpact.s_fcn.evaluate(box2D.collision.B2TimeOfImpact.s_xfA,box2D.collision.B2TimeOfImpact.s_xfB);
			if(box2D.common.math.B2Math.abs(f - target) < 0.025 * tolerance) {
				newAlpha = x;
				break;
			}
			if(f > target) {
				x1 = x;
				f1 = f;
			} else {
				x2 = x;
				f2 = f;
			}
			++rootIterCount;
			++box2D.collision.B2TimeOfImpact.b2_toiRootIters;
			if(rootIterCount == 50) break;
		}
		box2D.collision.B2TimeOfImpact.b2_toiMaxRootIters = Std["int"](box2D.common.math.B2Math.max(box2D.collision.B2TimeOfImpact.b2_toiMaxRootIters,rootIterCount));
		if(newAlpha < (1.0 + 100.0 * Number.MIN_VALUE) * alpha) break;
		alpha = newAlpha;
		iter++;
		++box2D.collision.B2TimeOfImpact.b2_toiIters;
		if(iter == k_maxIterations) break;
	}
	box2D.collision.B2TimeOfImpact.b2_toiMaxIters = Std["int"](box2D.common.math.B2Math.max(box2D.collision.B2TimeOfImpact.b2_toiMaxIters,iter));
	return alpha;
};
box2D.collision.shapes = {};
box2D.collision.shapes.B2Shape = function() {
	this.m_type = box2D.collision.shapes.B2ShapeType.UNKNOWN_SHAPE;
	this.m_radius = box2D.common.B2Settings.b2_linearSlop;
};
$hxClasses["box2D.collision.shapes.B2Shape"] = box2D.collision.shapes.B2Shape;
box2D.collision.shapes.B2Shape.__name__ = true;
box2D.collision.shapes.B2Shape.testOverlap = function(shape1,transform1,shape2,transform2) {
	return true;
};
box2D.collision.shapes.B2Shape.prototype = {
	copy: function() {
		return null;
	}
	,set: function(other) {
		this.m_radius = other.m_radius;
	}
	,getType: function() {
		return this.m_type;
	}
	,computeAABB: function(aabb,xf) {
	}
	,computeMass: function(massData,density) {
	}
	,__class__: box2D.collision.shapes.B2Shape
};
box2D.collision.shapes.B2CircleShape = function(radius) {
	if(radius == null) radius = 0;
	box2D.collision.shapes.B2Shape.call(this);
	this.m_p = new box2D.common.math.B2Vec2();
	this.m_type = box2D.collision.shapes.B2ShapeType.CIRCLE_SHAPE;
	this.m_radius = radius;
};
$hxClasses["box2D.collision.shapes.B2CircleShape"] = box2D.collision.shapes.B2CircleShape;
box2D.collision.shapes.B2CircleShape.__name__ = true;
box2D.collision.shapes.B2CircleShape.__super__ = box2D.collision.shapes.B2Shape;
box2D.collision.shapes.B2CircleShape.prototype = $extend(box2D.collision.shapes.B2Shape.prototype,{
	copy: function() {
		var s = new box2D.collision.shapes.B2CircleShape();
		s.set(this);
		return s;
	}
	,set: function(other) {
		box2D.collision.shapes.B2Shape.prototype.set.call(this,other);
		if(js.Boot.__instanceof(other,box2D.collision.shapes.B2CircleShape)) {
			var other2;
			other2 = js.Boot.__cast(other , box2D.collision.shapes.B2CircleShape);
			this.m_p.setV(other2.m_p);
		}
	}
	,computeAABB: function(aabb,transform) {
		var tMat = transform.R;
		var pX = transform.position.x + (tMat.col1.x * this.m_p.x + tMat.col2.x * this.m_p.y);
		var pY = transform.position.y + (tMat.col1.y * this.m_p.x + tMat.col2.y * this.m_p.y);
		aabb.lowerBound.set(pX - this.m_radius,pY - this.m_radius);
		aabb.upperBound.set(pX + this.m_radius,pY + this.m_radius);
	}
	,computeMass: function(massData,density) {
		massData.mass = density * box2D.common.B2Settings.b2_pi * this.m_radius * this.m_radius;
		massData.center.setV(this.m_p);
		massData.I = massData.mass * (0.5 * this.m_radius * this.m_radius + (this.m_p.x * this.m_p.x + this.m_p.y * this.m_p.y));
	}
	,__class__: box2D.collision.shapes.B2CircleShape
});
box2D.collision.shapes.B2EdgeShape = function() { };
$hxClasses["box2D.collision.shapes.B2EdgeShape"] = box2D.collision.shapes.B2EdgeShape;
box2D.collision.shapes.B2EdgeShape.__name__ = true;
box2D.collision.shapes.B2EdgeShape.__super__ = box2D.collision.shapes.B2Shape;
box2D.collision.shapes.B2EdgeShape.prototype = $extend(box2D.collision.shapes.B2Shape.prototype,{
	computeAABB: function(aabb,transform) {
		var tMat = transform.R;
		var v1X = transform.position.x + (tMat.col1.x * this.m_v1.x + tMat.col2.x * this.m_v1.y);
		var v1Y = transform.position.y + (tMat.col1.y * this.m_v1.x + tMat.col2.y * this.m_v1.y);
		var v2X = transform.position.x + (tMat.col1.x * this.m_v2.x + tMat.col2.x * this.m_v2.y);
		var v2Y = transform.position.y + (tMat.col1.y * this.m_v2.x + tMat.col2.y * this.m_v2.y);
		if(v1X < v2X) {
			aabb.lowerBound.x = v1X;
			aabb.upperBound.x = v2X;
		} else {
			aabb.lowerBound.x = v2X;
			aabb.upperBound.x = v1X;
		}
		if(v1Y < v2Y) {
			aabb.lowerBound.y = v1Y;
			aabb.upperBound.y = v2Y;
		} else {
			aabb.lowerBound.y = v2Y;
			aabb.upperBound.y = v1Y;
		}
	}
	,computeMass: function(massData,density) {
		massData.mass = 0;
		massData.center.setV(this.m_v1);
		massData.I = 0;
	}
	,__class__: box2D.collision.shapes.B2EdgeShape
});
box2D.collision.shapes.B2MassData = function() {
	this.mass = 0.0;
	this.center = new box2D.common.math.B2Vec2(0,0);
	this.I = 0.0;
};
$hxClasses["box2D.collision.shapes.B2MassData"] = box2D.collision.shapes.B2MassData;
box2D.collision.shapes.B2MassData.__name__ = true;
box2D.collision.shapes.B2MassData.prototype = {
	__class__: box2D.collision.shapes.B2MassData
};
box2D.collision.shapes.B2PolygonShape = function() {
	box2D.collision.shapes.B2Shape.call(this);
	this.m_type = box2D.collision.shapes.B2ShapeType.POLYGON_SHAPE;
	this.m_centroid = new box2D.common.math.B2Vec2();
	this.m_vertices = new Array();
	this.m_normals = new Array();
};
$hxClasses["box2D.collision.shapes.B2PolygonShape"] = box2D.collision.shapes.B2PolygonShape;
box2D.collision.shapes.B2PolygonShape.__name__ = true;
box2D.collision.shapes.B2PolygonShape.__super__ = box2D.collision.shapes.B2Shape;
box2D.collision.shapes.B2PolygonShape.prototype = $extend(box2D.collision.shapes.B2Shape.prototype,{
	copy: function() {
		var s = new box2D.collision.shapes.B2PolygonShape();
		s.set(this);
		return s;
	}
	,set: function(other) {
		box2D.collision.shapes.B2Shape.prototype.set.call(this,other);
		if(js.Boot.__instanceof(other,box2D.collision.shapes.B2PolygonShape)) {
			var other2;
			other2 = js.Boot.__cast(other , box2D.collision.shapes.B2PolygonShape);
			this.m_centroid.setV(other2.m_centroid);
			this.m_vertexCount = other2.m_vertexCount;
			this.reserve(this.m_vertexCount);
			var _g1 = 0;
			var _g = this.m_vertexCount;
			while(_g1 < _g) {
				var i = _g1++;
				this.m_vertices[i].setV(other2.m_vertices[i]);
				this.m_normals[i].setV(other2.m_normals[i]);
			}
		}
	}
	,setAsBox: function(hx,hy) {
		this.m_vertexCount = 4;
		this.reserve(4);
		this.m_vertices[0].set(-hx,-hy);
		this.m_vertices[1].set(hx,-hy);
		this.m_vertices[2].set(hx,hy);
		this.m_vertices[3].set(-hx,hy);
		this.m_normals[0].set(0.0,-1.0);
		this.m_normals[1].set(1.0,0.0);
		this.m_normals[2].set(0.0,1.0);
		this.m_normals[3].set(-1.0,0.0);
		this.m_centroid.setZero();
	}
	,computeAABB: function(aabb,xf) {
		var tMat = xf.R;
		var tVec = this.m_vertices[0];
		var lowerX = xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
		var lowerY = xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
		var upperX = lowerX;
		var upperY = lowerY;
		var _g1 = 1;
		var _g = this.m_vertexCount;
		while(_g1 < _g) {
			var i = _g1++;
			tVec = this.m_vertices[i];
			var vX = xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
			var vY = xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
			if(lowerX < vX) lowerX = lowerX; else lowerX = vX;
			if(lowerY < vY) lowerY = lowerY; else lowerY = vY;
			if(upperX > vX) upperX = upperX; else upperX = vX;
			if(upperY > vY) upperY = upperY; else upperY = vY;
		}
		aabb.lowerBound.x = lowerX - this.m_radius;
		aabb.lowerBound.y = lowerY - this.m_radius;
		aabb.upperBound.x = upperX + this.m_radius;
		aabb.upperBound.y = upperY + this.m_radius;
	}
	,computeMass: function(massData,density) {
		if(this.m_vertexCount == 2) {
			massData.center.x = 0.5 * (this.m_vertices[0].x + this.m_vertices[1].x);
			massData.center.y = 0.5 * (this.m_vertices[0].y + this.m_vertices[1].y);
			massData.mass = 0.0;
			massData.I = 0.0;
			return;
		}
		var centerX = 0.0;
		var centerY = 0.0;
		var area = 0.0;
		var I = 0.0;
		var p1X = 0.0;
		var p1Y = 0.0;
		var k_inv3 = 0.33333333333333331;
		var _g1 = 0;
		var _g = this.m_vertexCount;
		while(_g1 < _g) {
			var i = _g1++;
			var p2 = this.m_vertices[i];
			var p3;
			if(i + 1 < this.m_vertexCount) p3 = this.m_vertices[i + 1 | 0]; else p3 = this.m_vertices[0];
			var e1X = p2.x - p1X;
			var e1Y = p2.y - p1Y;
			var e2X = p3.x - p1X;
			var e2Y = p3.y - p1Y;
			var D = e1X * e2Y - e1Y * e2X;
			var triangleArea = 0.5 * D;
			area += triangleArea;
			centerX += triangleArea * k_inv3 * (p1X + p2.x + p3.x);
			centerY += triangleArea * k_inv3 * (p1Y + p2.y + p3.y);
			var px = p1X;
			var py = p1Y;
			var ex1 = e1X;
			var ey1 = e1Y;
			var ex2 = e2X;
			var ey2 = e2Y;
			var intx2 = k_inv3 * (0.25 * (ex1 * ex1 + ex2 * ex1 + ex2 * ex2) + (px * ex1 + px * ex2)) + 0.5 * px * px;
			var inty2 = k_inv3 * (0.25 * (ey1 * ey1 + ey2 * ey1 + ey2 * ey2) + (py * ey1 + py * ey2)) + 0.5 * py * py;
			I += D * (intx2 + inty2);
		}
		massData.mass = density * area;
		centerX *= 1.0 / area;
		centerY *= 1.0 / area;
		massData.center.set(centerX,centerY);
		massData.I = density * I;
	}
	,reserve: function(count) {
		var _g = this.m_vertices.length;
		while(_g < count) {
			var i = _g++;
			this.m_vertices[i] = new box2D.common.math.B2Vec2();
			this.m_normals[i] = new box2D.common.math.B2Vec2();
		}
	}
	,__class__: box2D.collision.shapes.B2PolygonShape
});
box2D.collision.shapes.B2ShapeType = $hxClasses["box2D.collision.shapes.B2ShapeType"] = { __ename__ : true, __constructs__ : ["UNKNOWN_SHAPE","CIRCLE_SHAPE","POLYGON_SHAPE","EDGE_SHAPE"] };
box2D.collision.shapes.B2ShapeType.UNKNOWN_SHAPE = ["UNKNOWN_SHAPE",0];
box2D.collision.shapes.B2ShapeType.UNKNOWN_SHAPE.toString = $estr;
box2D.collision.shapes.B2ShapeType.UNKNOWN_SHAPE.__enum__ = box2D.collision.shapes.B2ShapeType;
box2D.collision.shapes.B2ShapeType.CIRCLE_SHAPE = ["CIRCLE_SHAPE",1];
box2D.collision.shapes.B2ShapeType.CIRCLE_SHAPE.toString = $estr;
box2D.collision.shapes.B2ShapeType.CIRCLE_SHAPE.__enum__ = box2D.collision.shapes.B2ShapeType;
box2D.collision.shapes.B2ShapeType.POLYGON_SHAPE = ["POLYGON_SHAPE",2];
box2D.collision.shapes.B2ShapeType.POLYGON_SHAPE.toString = $estr;
box2D.collision.shapes.B2ShapeType.POLYGON_SHAPE.__enum__ = box2D.collision.shapes.B2ShapeType;
box2D.collision.shapes.B2ShapeType.EDGE_SHAPE = ["EDGE_SHAPE",3];
box2D.collision.shapes.B2ShapeType.EDGE_SHAPE.toString = $estr;
box2D.collision.shapes.B2ShapeType.EDGE_SHAPE.__enum__ = box2D.collision.shapes.B2ShapeType;
box2D.collision.shapes.B2ShapeType.__empty_constructs__ = [box2D.collision.shapes.B2ShapeType.UNKNOWN_SHAPE,box2D.collision.shapes.B2ShapeType.CIRCLE_SHAPE,box2D.collision.shapes.B2ShapeType.POLYGON_SHAPE,box2D.collision.shapes.B2ShapeType.EDGE_SHAPE];
box2D.dynamics.B2DebugDraw = function() { };
$hxClasses["box2D.dynamics.B2DebugDraw"] = box2D.dynamics.B2DebugDraw;
box2D.dynamics.B2DebugDraw.__name__ = true;
box2D.dynamics.B2DestructionListener = function() { };
$hxClasses["box2D.dynamics.B2DestructionListener"] = box2D.dynamics.B2DestructionListener;
box2D.dynamics.B2DestructionListener.__name__ = true;
box2D.dynamics.B2FilterData = function() {
	this.categoryBits = 1;
	this.maskBits = 65535;
	this.groupIndex = 0;
};
$hxClasses["box2D.dynamics.B2FilterData"] = box2D.dynamics.B2FilterData;
box2D.dynamics.B2FilterData.__name__ = true;
box2D.dynamics.B2FilterData.prototype = {
	copy: function() {
		var copy = new box2D.dynamics.B2FilterData();
		copy.categoryBits = this.categoryBits;
		copy.maskBits = this.maskBits;
		copy.groupIndex = this.groupIndex;
		return copy;
	}
	,__class__: box2D.dynamics.B2FilterData
};
box2D.dynamics.B2Fixture = function() {
	this.m_filter = new box2D.dynamics.B2FilterData();
	this.m_aabb = new box2D.collision.B2AABB();
	this.m_userData = null;
	this.m_body = null;
	this.m_next = null;
	this.m_shape = null;
	this.m_density = 0.0;
	this.m_friction = 0.0;
	this.m_restitution = 0.0;
};
$hxClasses["box2D.dynamics.B2Fixture"] = box2D.dynamics.B2Fixture;
box2D.dynamics.B2Fixture.__name__ = true;
box2D.dynamics.B2Fixture.prototype = {
	getType: function() {
		return this.m_shape.getType();
	}
	,getShape: function() {
		return this.m_shape;
	}
	,isSensor: function() {
		return this.m_isSensor;
	}
	,getFilterData: function() {
		return this.m_filter.copy();
	}
	,getBody: function() {
		return this.m_body;
	}
	,getMassData: function(massData) {
		if(massData == null) massData = new box2D.collision.shapes.B2MassData();
		this.m_shape.computeMass(massData,this.m_density);
		return massData;
	}
	,getFriction: function() {
		return this.m_friction;
	}
	,getRestitution: function() {
		return this.m_restitution;
	}
	,create: function(body,xf,def) {
		this.m_userData = def.userData;
		this.m_friction = def.friction;
		this.m_restitution = def.restitution;
		this.m_body = body;
		this.m_next = null;
		this.m_filter = def.filter.copy();
		this.m_isSensor = def.isSensor;
		this.m_shape = def.shape.copy();
		this.m_density = def.density;
	}
	,createProxy: function(broadPhase,xf) {
		this.m_shape.computeAABB(this.m_aabb,xf);
		this.m_proxy = broadPhase.createProxy(this.m_aabb,this);
	}
	,synchronize: function(broadPhase,transform1,transform2) {
		if(this.m_proxy == null) return;
		var aabb1 = new box2D.collision.B2AABB();
		var aabb2 = new box2D.collision.B2AABB();
		this.m_shape.computeAABB(aabb1,transform1);
		this.m_shape.computeAABB(aabb2,transform2);
		this.m_aabb.combine(aabb1,aabb2);
		var displacement = box2D.common.math.B2Math.subtractVV(transform2.position,transform1.position);
		broadPhase.moveProxy(this.m_proxy,this.m_aabb,displacement);
	}
	,__class__: box2D.dynamics.B2Fixture
};
box2D.dynamics.B2FixtureDef = function() {
	this.filter = new box2D.dynamics.B2FilterData();
	this.shape = null;
	this.userData = null;
	this.friction = 0.2;
	this.restitution = 0.0;
	this.density = 0.0;
	this.filter.categoryBits = 1;
	this.filter.maskBits = 65535;
	this.filter.groupIndex = 0;
	this.isSensor = false;
};
$hxClasses["box2D.dynamics.B2FixtureDef"] = box2D.dynamics.B2FixtureDef;
box2D.dynamics.B2FixtureDef.__name__ = true;
box2D.dynamics.B2FixtureDef.prototype = {
	__class__: box2D.dynamics.B2FixtureDef
};
box2D.dynamics.contacts.B2Contact = function() {
	this.m_nodeA = new box2D.dynamics.contacts.B2ContactEdge();
	this.m_nodeB = new box2D.dynamics.contacts.B2ContactEdge();
	this.m_manifold = new box2D.collision.B2Manifold();
	this.m_oldManifold = new box2D.collision.B2Manifold();
};
$hxClasses["box2D.dynamics.contacts.B2Contact"] = box2D.dynamics.contacts.B2Contact;
box2D.dynamics.contacts.B2Contact.__name__ = true;
box2D.dynamics.contacts.B2Contact.prototype = {
	getManifold: function() {
		return this.m_manifold;
	}
	,isTouching: function() {
		return (this.m_flags & box2D.dynamics.contacts.B2Contact.e_touchingFlag) == box2D.dynamics.contacts.B2Contact.e_touchingFlag;
	}
	,isContinuous: function() {
		return (this.m_flags & box2D.dynamics.contacts.B2Contact.e_continuousFlag) == box2D.dynamics.contacts.B2Contact.e_continuousFlag;
	}
	,isSensor: function() {
		return (this.m_flags & box2D.dynamics.contacts.B2Contact.e_sensorFlag) == box2D.dynamics.contacts.B2Contact.e_sensorFlag;
	}
	,isEnabled: function() {
		return (this.m_flags & box2D.dynamics.contacts.B2Contact.e_enabledFlag) == box2D.dynamics.contacts.B2Contact.e_enabledFlag;
	}
	,getNext: function() {
		return this.m_next;
	}
	,getFixtureA: function() {
		return this.m_fixtureA;
	}
	,getFixtureB: function() {
		return this.m_fixtureB;
	}
	,reset: function(fixtureA,fixtureB) {
		this.m_flags = box2D.dynamics.contacts.B2Contact.e_enabledFlag;
		if(fixtureA == null || fixtureB == null) {
			this.m_fixtureA = null;
			this.m_fixtureB = null;
			return;
		}
		if(fixtureA.isSensor() || fixtureB.isSensor()) this.m_flags |= box2D.dynamics.contacts.B2Contact.e_sensorFlag;
		var bodyA = fixtureA.getBody();
		var bodyB = fixtureB.getBody();
		if(bodyA.getType() != box2D.dynamics.B2Body.b2_dynamicBody || bodyA.isBullet() || bodyB.getType() != box2D.dynamics.B2Body.b2_dynamicBody || bodyB.isBullet()) this.m_flags |= box2D.dynamics.contacts.B2Contact.e_continuousFlag;
		this.m_fixtureA = fixtureA;
		this.m_fixtureB = fixtureB;
		this.m_manifold.m_pointCount = 0;
		this.m_prev = null;
		this.m_next = null;
		this.m_nodeA.contact = null;
		this.m_nodeA.prev = null;
		this.m_nodeA.next = null;
		this.m_nodeA.other = null;
		this.m_nodeB.contact = null;
		this.m_nodeB.prev = null;
		this.m_nodeB.next = null;
		this.m_nodeB.other = null;
	}
	,update: function(listener) {
		var tManifold = this.m_oldManifold;
		this.m_oldManifold = this.m_manifold;
		this.m_manifold = tManifold;
		this.m_flags |= box2D.dynamics.contacts.B2Contact.e_enabledFlag;
		var touching = false;
		var wasTouching = (this.m_flags & box2D.dynamics.contacts.B2Contact.e_touchingFlag) == box2D.dynamics.contacts.B2Contact.e_touchingFlag;
		var bodyA = this.m_fixtureA.m_body;
		var bodyB = this.m_fixtureB.m_body;
		var aabbOverlap = this.m_fixtureA.m_aabb.testOverlap(this.m_fixtureB.m_aabb);
		if((this.m_flags & box2D.dynamics.contacts.B2Contact.e_sensorFlag) != 0) {
			if(aabbOverlap) {
				var shapeA = this.m_fixtureA.getShape();
				var shapeB = this.m_fixtureB.getShape();
				var xfA = bodyA.getTransform();
				var xfB = bodyB.getTransform();
				touching = box2D.collision.shapes.B2Shape.testOverlap(shapeA,xfA,shapeB,xfB);
			}
			this.m_manifold.m_pointCount = 0;
		} else {
			if(bodyA.getType() != box2D.dynamics.B2Body.b2_dynamicBody || bodyA.isBullet() || bodyB.getType() != box2D.dynamics.B2Body.b2_dynamicBody || bodyB.isBullet()) this.m_flags |= box2D.dynamics.contacts.B2Contact.e_continuousFlag; else this.m_flags &= ~box2D.dynamics.contacts.B2Contact.e_continuousFlag;
			if(aabbOverlap) {
				this.evaluate();
				touching = this.m_manifold.m_pointCount > 0;
				var _g1 = 0;
				var _g = this.m_manifold.m_pointCount;
				while(_g1 < _g) {
					var i = _g1++;
					var mp2 = this.m_manifold.m_points[i];
					mp2.m_normalImpulse = 0.0;
					mp2.m_tangentImpulse = 0.0;
					var id2 = mp2.m_id;
					var _g3 = 0;
					var _g2 = this.m_oldManifold.m_pointCount;
					while(_g3 < _g2) {
						var j = _g3++;
						var mp1 = this.m_oldManifold.m_points[j];
						if(mp1.m_id.get_key() == id2.get_key()) {
							mp2.m_normalImpulse = mp1.m_normalImpulse;
							mp2.m_tangentImpulse = mp1.m_tangentImpulse;
							break;
						}
					}
				}
			} else this.m_manifold.m_pointCount = 0;
			if(touching != wasTouching) {
				bodyA.setAwake(true);
				bodyB.setAwake(true);
			}
		}
		if(touching) this.m_flags |= box2D.dynamics.contacts.B2Contact.e_touchingFlag; else this.m_flags &= ~box2D.dynamics.contacts.B2Contact.e_touchingFlag;
		if(wasTouching == false && touching == true) listener.beginContact(this);
		if(wasTouching == true && touching == false) listener.endContact(this);
		if((this.m_flags & box2D.dynamics.contacts.B2Contact.e_sensorFlag) == 0) listener.preSolve(this,this.m_oldManifold);
	}
	,evaluate: function() {
	}
	,computeTOI: function(sweepA,sweepB) {
		box2D.dynamics.contacts.B2Contact.s_input.proxyA.set(this.m_fixtureA.getShape());
		box2D.dynamics.contacts.B2Contact.s_input.proxyB.set(this.m_fixtureB.getShape());
		box2D.dynamics.contacts.B2Contact.s_input.sweepA = sweepA;
		box2D.dynamics.contacts.B2Contact.s_input.sweepB = sweepB;
		box2D.dynamics.contacts.B2Contact.s_input.tolerance = box2D.common.B2Settings.b2_linearSlop;
		return box2D.collision.B2TimeOfImpact.timeOfImpact(box2D.dynamics.contacts.B2Contact.s_input);
	}
	,__class__: box2D.dynamics.contacts.B2Contact
};
box2D.dynamics.contacts.B2CircleContact = function() {
	box2D.dynamics.contacts.B2Contact.call(this);
};
$hxClasses["box2D.dynamics.contacts.B2CircleContact"] = box2D.dynamics.contacts.B2CircleContact;
box2D.dynamics.contacts.B2CircleContact.__name__ = true;
box2D.dynamics.contacts.B2CircleContact.create = function(allocator) {
	return new box2D.dynamics.contacts.B2CircleContact();
};
box2D.dynamics.contacts.B2CircleContact.destroy = function(contact,allocator) {
};
box2D.dynamics.contacts.B2CircleContact.__super__ = box2D.dynamics.contacts.B2Contact;
box2D.dynamics.contacts.B2CircleContact.prototype = $extend(box2D.dynamics.contacts.B2Contact.prototype,{
	reset: function(fixtureA,fixtureB) {
		box2D.dynamics.contacts.B2Contact.prototype.reset.call(this,fixtureA,fixtureB);
	}
	,evaluate: function() {
		var bA = this.m_fixtureA.getBody();
		var bB = this.m_fixtureB.getBody();
		box2D.collision.B2Collision.collideCircles(this.m_manifold,js.Boot.__cast(this.m_fixtureA.getShape() , box2D.collision.shapes.B2CircleShape),bA.m_xf,js.Boot.__cast(this.m_fixtureB.getShape() , box2D.collision.shapes.B2CircleShape),bB.m_xf);
	}
	,__class__: box2D.dynamics.contacts.B2CircleContact
});
box2D.dynamics.contacts.B2ContactConstraint = function() {
	this.localPlaneNormal = new box2D.common.math.B2Vec2();
	this.localPoint = new box2D.common.math.B2Vec2();
	this.normal = new box2D.common.math.B2Vec2();
	this.normalMass = new box2D.common.math.B2Mat22();
	this.K = new box2D.common.math.B2Mat22();
	this.points = new Array();
	var _g1 = 0;
	var _g = box2D.common.B2Settings.b2_maxManifoldPoints;
	while(_g1 < _g) {
		var i = _g1++;
		this.points[i] = new box2D.dynamics.contacts.B2ContactConstraintPoint();
	}
};
$hxClasses["box2D.dynamics.contacts.B2ContactConstraint"] = box2D.dynamics.contacts.B2ContactConstraint;
box2D.dynamics.contacts.B2ContactConstraint.__name__ = true;
box2D.dynamics.contacts.B2ContactConstraint.prototype = {
	__class__: box2D.dynamics.contacts.B2ContactConstraint
};
box2D.dynamics.contacts.B2ContactConstraintPoint = function() {
	this.localPoint = new box2D.common.math.B2Vec2();
	this.rA = new box2D.common.math.B2Vec2();
	this.rB = new box2D.common.math.B2Vec2();
};
$hxClasses["box2D.dynamics.contacts.B2ContactConstraintPoint"] = box2D.dynamics.contacts.B2ContactConstraintPoint;
box2D.dynamics.contacts.B2ContactConstraintPoint.__name__ = true;
box2D.dynamics.contacts.B2ContactConstraintPoint.prototype = {
	__class__: box2D.dynamics.contacts.B2ContactConstraintPoint
};
box2D.dynamics.contacts.B2ContactEdge = function() {
};
$hxClasses["box2D.dynamics.contacts.B2ContactEdge"] = box2D.dynamics.contacts.B2ContactEdge;
box2D.dynamics.contacts.B2ContactEdge.__name__ = true;
box2D.dynamics.contacts.B2ContactEdge.prototype = {
	__class__: box2D.dynamics.contacts.B2ContactEdge
};
box2D.dynamics.contacts.B2ContactRegister = function() {
};
$hxClasses["box2D.dynamics.contacts.B2ContactRegister"] = box2D.dynamics.contacts.B2ContactRegister;
box2D.dynamics.contacts.B2ContactRegister.__name__ = true;
box2D.dynamics.contacts.B2ContactRegister.prototype = {
	__class__: box2D.dynamics.contacts.B2ContactRegister
};
box2D.dynamics.contacts.B2EdgeAndCircleContact = function() {
	box2D.dynamics.contacts.B2Contact.call(this);
};
$hxClasses["box2D.dynamics.contacts.B2EdgeAndCircleContact"] = box2D.dynamics.contacts.B2EdgeAndCircleContact;
box2D.dynamics.contacts.B2EdgeAndCircleContact.__name__ = true;
box2D.dynamics.contacts.B2EdgeAndCircleContact.create = function(allocator) {
	return new box2D.dynamics.contacts.B2EdgeAndCircleContact();
};
box2D.dynamics.contacts.B2EdgeAndCircleContact.destroy = function(contact,allocator) {
};
box2D.dynamics.contacts.B2EdgeAndCircleContact.__super__ = box2D.dynamics.contacts.B2Contact;
box2D.dynamics.contacts.B2EdgeAndCircleContact.prototype = $extend(box2D.dynamics.contacts.B2Contact.prototype,{
	reset: function(fixtureA,fixtureB) {
		box2D.dynamics.contacts.B2Contact.prototype.reset.call(this,fixtureA,fixtureB);
	}
	,evaluate: function() {
		var bA = this.m_fixtureA.getBody();
		var bB = this.m_fixtureB.getBody();
		this.b2CollideEdgeAndCircle(this.m_manifold,js.Boot.__cast(this.m_fixtureA.getShape() , box2D.collision.shapes.B2EdgeShape),bA.m_xf,js.Boot.__cast(this.m_fixtureB.getShape() , box2D.collision.shapes.B2CircleShape),bB.m_xf);
	}
	,b2CollideEdgeAndCircle: function(manifold,edge,xf1,circle,xf2) {
	}
	,__class__: box2D.dynamics.contacts.B2EdgeAndCircleContact
});
box2D.dynamics.contacts.B2PolyAndCircleContact = function() {
	box2D.dynamics.contacts.B2Contact.call(this);
};
$hxClasses["box2D.dynamics.contacts.B2PolyAndCircleContact"] = box2D.dynamics.contacts.B2PolyAndCircleContact;
box2D.dynamics.contacts.B2PolyAndCircleContact.__name__ = true;
box2D.dynamics.contacts.B2PolyAndCircleContact.create = function(allocator) {
	return new box2D.dynamics.contacts.B2PolyAndCircleContact();
};
box2D.dynamics.contacts.B2PolyAndCircleContact.destroy = function(contact,allocator) {
};
box2D.dynamics.contacts.B2PolyAndCircleContact.__super__ = box2D.dynamics.contacts.B2Contact;
box2D.dynamics.contacts.B2PolyAndCircleContact.prototype = $extend(box2D.dynamics.contacts.B2Contact.prototype,{
	reset: function(fixtureA,fixtureB) {
		box2D.dynamics.contacts.B2Contact.prototype.reset.call(this,fixtureA,fixtureB);
		box2D.common.B2Settings.b2Assert(fixtureA.getType() == box2D.collision.shapes.B2ShapeType.POLYGON_SHAPE);
		box2D.common.B2Settings.b2Assert(fixtureB.getType() == box2D.collision.shapes.B2ShapeType.CIRCLE_SHAPE);
	}
	,evaluate: function() {
		var bA = this.m_fixtureA.m_body;
		var bB = this.m_fixtureB.m_body;
		box2D.collision.B2Collision.collidePolygonAndCircle(this.m_manifold,js.Boot.__cast(this.m_fixtureA.getShape() , box2D.collision.shapes.B2PolygonShape),bA.m_xf,js.Boot.__cast(this.m_fixtureB.getShape() , box2D.collision.shapes.B2CircleShape),bB.m_xf);
	}
	,__class__: box2D.dynamics.contacts.B2PolyAndCircleContact
});
box2D.dynamics.contacts.B2PolyAndEdgeContact = function() {
	box2D.dynamics.contacts.B2Contact.call(this);
};
$hxClasses["box2D.dynamics.contacts.B2PolyAndEdgeContact"] = box2D.dynamics.contacts.B2PolyAndEdgeContact;
box2D.dynamics.contacts.B2PolyAndEdgeContact.__name__ = true;
box2D.dynamics.contacts.B2PolyAndEdgeContact.create = function(allocator) {
	return new box2D.dynamics.contacts.B2PolyAndEdgeContact();
};
box2D.dynamics.contacts.B2PolyAndEdgeContact.destroy = function(contact,allocator) {
};
box2D.dynamics.contacts.B2PolyAndEdgeContact.__super__ = box2D.dynamics.contacts.B2Contact;
box2D.dynamics.contacts.B2PolyAndEdgeContact.prototype = $extend(box2D.dynamics.contacts.B2Contact.prototype,{
	reset: function(fixtureA,fixtureB) {
		box2D.dynamics.contacts.B2Contact.prototype.reset.call(this,fixtureA,fixtureB);
		box2D.common.B2Settings.b2Assert(fixtureA.getType() == box2D.collision.shapes.B2ShapeType.POLYGON_SHAPE);
		box2D.common.B2Settings.b2Assert(fixtureB.getType() == box2D.collision.shapes.B2ShapeType.EDGE_SHAPE);
	}
	,evaluate: function() {
		var bA = this.m_fixtureA.getBody();
		var bB = this.m_fixtureB.getBody();
		this.b2CollidePolyAndEdge(this.m_manifold,js.Boot.__cast(this.m_fixtureA.getShape() , box2D.collision.shapes.B2PolygonShape),bA.m_xf,js.Boot.__cast(this.m_fixtureB.getShape() , box2D.collision.shapes.B2EdgeShape),bB.m_xf);
	}
	,b2CollidePolyAndEdge: function(manifold,polygon,xf1,edge,xf2) {
	}
	,__class__: box2D.dynamics.contacts.B2PolyAndEdgeContact
});
box2D.dynamics.contacts.B2PolygonContact = function() {
	box2D.dynamics.contacts.B2Contact.call(this);
};
$hxClasses["box2D.dynamics.contacts.B2PolygonContact"] = box2D.dynamics.contacts.B2PolygonContact;
box2D.dynamics.contacts.B2PolygonContact.__name__ = true;
box2D.dynamics.contacts.B2PolygonContact.create = function(allocator) {
	return new box2D.dynamics.contacts.B2PolygonContact();
};
box2D.dynamics.contacts.B2PolygonContact.destroy = function(contact,allocator) {
};
box2D.dynamics.contacts.B2PolygonContact.__super__ = box2D.dynamics.contacts.B2Contact;
box2D.dynamics.contacts.B2PolygonContact.prototype = $extend(box2D.dynamics.contacts.B2Contact.prototype,{
	reset: function(fixtureA,fixtureB) {
		box2D.dynamics.contacts.B2Contact.prototype.reset.call(this,fixtureA,fixtureB);
	}
	,evaluate: function() {
		var bA = this.m_fixtureA.getBody();
		var bB = this.m_fixtureB.getBody();
		box2D.collision.B2Collision.collidePolygons(this.m_manifold,js.Boot.__cast(this.m_fixtureA.getShape() , box2D.collision.shapes.B2PolygonShape),bA.m_xf,js.Boot.__cast(this.m_fixtureB.getShape() , box2D.collision.shapes.B2PolygonShape),bB.m_xf);
	}
	,__class__: box2D.dynamics.contacts.B2PolygonContact
});
box2D.dynamics.controllers = {};
box2D.dynamics.controllers.B2Controller = function() { };
$hxClasses["box2D.dynamics.controllers.B2Controller"] = box2D.dynamics.controllers.B2Controller;
box2D.dynamics.controllers.B2Controller.__name__ = true;
box2D.dynamics.controllers.B2Controller.prototype = {
	step: function(step) {
	}
	,__class__: box2D.dynamics.controllers.B2Controller
};
box2D.dynamics.controllers.B2ControllerEdge = function() { };
$hxClasses["box2D.dynamics.controllers.B2ControllerEdge"] = box2D.dynamics.controllers.B2ControllerEdge;
box2D.dynamics.controllers.B2ControllerEdge.__name__ = true;
box2D.dynamics.joints = {};
box2D.dynamics.joints.B2Joint = function() { };
$hxClasses["box2D.dynamics.joints.B2Joint"] = box2D.dynamics.joints.B2Joint;
box2D.dynamics.joints.B2Joint.__name__ = true;
box2D.dynamics.joints.B2Joint.prototype = {
	initVelocityConstraints: function(step) {
	}
	,solveVelocityConstraints: function(step) {
	}
	,finalizeVelocityConstraints: function() {
	}
	,solvePositionConstraints: function(baumgarte) {
		return false;
	}
	,__class__: box2D.dynamics.joints.B2Joint
};
box2D.dynamics.joints.B2JointEdge = function() { };
$hxClasses["box2D.dynamics.joints.B2JointEdge"] = box2D.dynamics.joints.B2JointEdge;
box2D.dynamics.joints.B2JointEdge.__name__ = true;
box2D.dynamics.joints.B2JointEdge.prototype = {
	__class__: box2D.dynamics.joints.B2JointEdge
};
var format = {};
format.png = {};
format.png.Color = $hxClasses["format.png.Color"] = { __ename__ : true, __constructs__ : ["ColGrey","ColTrue","ColIndexed"] };
format.png.Color.ColGrey = function(alpha) { var $x = ["ColGrey",0,alpha]; $x.__enum__ = format.png.Color; $x.toString = $estr; return $x; };
format.png.Color.ColTrue = function(alpha) { var $x = ["ColTrue",1,alpha]; $x.__enum__ = format.png.Color; $x.toString = $estr; return $x; };
format.png.Color.ColIndexed = ["ColIndexed",2];
format.png.Color.ColIndexed.toString = $estr;
format.png.Color.ColIndexed.__enum__ = format.png.Color;
format.png.Color.__empty_constructs__ = [format.png.Color.ColIndexed];
format.png.Chunk = $hxClasses["format.png.Chunk"] = { __ename__ : true, __constructs__ : ["CEnd","CHeader","CData","CPalette","CUnknown"] };
format.png.Chunk.CEnd = ["CEnd",0];
format.png.Chunk.CEnd.toString = $estr;
format.png.Chunk.CEnd.__enum__ = format.png.Chunk;
format.png.Chunk.CHeader = function(h) { var $x = ["CHeader",1,h]; $x.__enum__ = format.png.Chunk; $x.toString = $estr; return $x; };
format.png.Chunk.CData = function(b) { var $x = ["CData",2,b]; $x.__enum__ = format.png.Chunk; $x.toString = $estr; return $x; };
format.png.Chunk.CPalette = function(b) { var $x = ["CPalette",3,b]; $x.__enum__ = format.png.Chunk; $x.toString = $estr; return $x; };
format.png.Chunk.CUnknown = function(id,data) { var $x = ["CUnknown",4,id,data]; $x.__enum__ = format.png.Chunk; $x.toString = $estr; return $x; };
format.png.Chunk.__empty_constructs__ = [format.png.Chunk.CEnd];
format.png.Reader = function(i) {
	this.i = i;
	i.set_bigEndian(true);
	this.checkCRC = true;
};
$hxClasses["format.png.Reader"] = format.png.Reader;
format.png.Reader.__name__ = true;
format.png.Reader.prototype = {
	read: function() {
		var _g = 0;
		var _g1 = [137,80,78,71,13,10,26,10];
		while(_g < _g1.length) {
			var b = _g1[_g];
			++_g;
			if(this.i.readByte() != b) throw "Invalid header";
		}
		var l = new List();
		while(true) {
			var c = this.readChunk();
			l.add(c);
			if(c == format.png.Chunk.CEnd) break;
		}
		return l;
	}
	,readHeader: function(i) {
		i.set_bigEndian(true);
		var width = i.readInt32();
		var height = i.readInt32();
		var colbits = i.readByte();
		var color = i.readByte();
		var color1;
		switch(color) {
		case 0:
			color1 = format.png.Color.ColGrey(false);
			break;
		case 2:
			color1 = format.png.Color.ColTrue(false);
			break;
		case 3:
			color1 = format.png.Color.ColIndexed;
			break;
		case 4:
			color1 = format.png.Color.ColGrey(true);
			break;
		case 6:
			color1 = format.png.Color.ColTrue(true);
			break;
		default:
			throw "Unknown color model " + color + ":" + colbits;
		}
		var compress = i.readByte();
		var filter = i.readByte();
		if(compress != 0 || filter != 0) throw "Invalid header";
		var interlace = i.readByte();
		if(interlace != 0 && interlace != 1) throw "Invalid header";
		return { width : width, height : height, colbits : colbits, color : color1, interlaced : interlace == 1};
	}
	,readChunk: function() {
		var dataLen = this.i.readInt32();
		var id = this.i.readString(4);
		var data = this.i.read(dataLen);
		var crc = this.i.readInt32();
		if(this.checkCRC) {
			var c = new haxe.crypto.Crc32();
			var _g = 0;
			while(_g < 4) {
				var i = _g++;
				c["byte"](HxOverrides.cca(id,i));
			}
			c.update(data,0,data.length);
			if(c.get() != crc) throw "CRC check failure";
		}
		switch(id) {
		case "IEND":
			return format.png.Chunk.CEnd;
		case "IHDR":
			return format.png.Chunk.CHeader(this.readHeader(new haxe.io.BytesInput(data)));
		case "IDAT":
			return format.png.Chunk.CData(data);
		case "PLTE":
			return format.png.Chunk.CPalette(data);
		default:
			return format.png.Chunk.CUnknown(id,data);
		}
	}
	,__class__: format.png.Reader
};
format.png.Tools = function() { };
$hxClasses["format.png.Tools"] = format.png.Tools;
format.png.Tools.__name__ = true;
format.png.Tools.getHeader = function(d) {
	var $it0 = d.iterator();
	while( $it0.hasNext() ) {
		var c = $it0.next();
		switch(c[1]) {
		case 1:
			var h = c[2];
			return h;
		default:
		}
	}
	throw "Header not found";
};
format.png.Tools.getPalette = function(d) {
	var $it0 = d.iterator();
	while( $it0.hasNext() ) {
		var c = $it0.next();
		switch(c[1]) {
		case 3:
			var b = c[2];
			return b;
		default:
		}
	}
	return null;
};
format.png.Tools.filter = function(data,x,y,stride,prev,p,numChannels) {
	if(numChannels == null) numChannels = 4;
	var b;
	if(y == 0) b = 0; else b = data.b[p - stride];
	var c;
	if(x == 0 || y == 0) c = 0; else c = data.b[p - stride - numChannels];
	var k = prev + b - c;
	var pa = k - prev;
	if(pa < 0) pa = -pa;
	var pb = k - b;
	if(pb < 0) pb = -pb;
	var pc = k - c;
	if(pc < 0) pc = -pc;
	if(pa <= pb && pa <= pc) return prev; else if(pb <= pc) return b; else return c;
};
format.png.Tools.extract32 = function(d,bytes) {
	var h = format.png.Tools.getHeader(d);
	var bgra;
	if(bytes == null) bgra = haxe.io.Bytes.alloc(h.width * h.height * 4); else bgra = bytes;
	var data = null;
	var fullData = null;
	var $it0 = d.iterator();
	while( $it0.hasNext() ) {
		var c = $it0.next();
		switch(c[1]) {
		case 2:
			var b = c[2];
			if(fullData != null) fullData.add(b); else if(data == null) data = b; else {
				fullData = new haxe.io.BytesBuffer();
				fullData.add(data);
				fullData.add(b);
				data = null;
			}
			break;
		default:
		}
	}
	if(fullData != null) data = fullData.getBytes();
	if(data == null) throw "Data not found";
	data = format.tools.Inflate.run(data);
	var r = 0;
	var w = 0;
	{
		var _g = h.color;
		switch(_g[1]) {
		case 2:
			var pal = format.png.Tools.getPalette(d);
			if(pal == null) throw "PNG Palette is missing";
			var alpha = null;
			try {
				var $it1 = d.iterator();
				while( $it1.hasNext() ) {
					var t = $it1.next();
					switch(t[1]) {
					case 4:
						switch(t[2]) {
						case "tRNS":
							var data1 = t[3];
							alpha = data1;
							throw "__break__";
							break;
						default:
						}
						break;
					default:
					}
				}
			} catch( e ) { if( e != "__break__" ) throw e; }
			var width = h.width;
			var stride = width + 1;
			if(data.length < h.height * stride) throw "Not enough data";
			var vr;
			var vg;
			var vb;
			var va = 255;
			var _g2 = 0;
			var _g1 = h.height;
			while(_g2 < _g1) {
				var y = _g2++;
				var f = data.get(r++);
				switch(f) {
				case 0:
					var _g3 = 0;
					while(_g3 < width) {
						var x = _g3++;
						var c1 = data.get(r++);
						vr = pal.b[c1 * 3];
						vg = pal.b[c1 * 3 + 1];
						vb = pal.b[c1 * 3 + 2];
						if(alpha != null) va = alpha.b[c1];
						bgra.set(w++,vb);
						bgra.set(w++,vg);
						bgra.set(w++,vr);
						bgra.set(w++,va);
					}
					break;
				case 1:
					var cr = 0;
					var cg = 0;
					var cb = 0;
					var ca = 0;
					var _g31 = 0;
					while(_g31 < width) {
						var x1 = _g31++;
						var c2 = data.get(r++);
						vr = pal.b[c2 * 3];
						vg = pal.b[c2 * 3 + 1];
						vb = pal.b[c2 * 3 + 2];
						if(alpha != null) va = alpha.b[c2];
						cb += vb;
						bgra.set(w++,cb);
						cg += vg;
						bgra.set(w++,cg);
						cr += vr;
						bgra.set(w++,cr);
						ca += va;
						bgra.set(w++,ca);
						bgra.set(w++,va);
					}
					break;
				case 2:
					var stride1;
					if(y == 0) stride1 = 0; else stride1 = width * 4;
					var _g32 = 0;
					while(_g32 < width) {
						var x2 = _g32++;
						var c3 = data.get(r++);
						vr = pal.b[c3 * 3];
						vg = pal.b[c3 * 3 + 1];
						vb = pal.b[c3 * 3 + 2];
						if(alpha != null) va = alpha.b[c3];
						bgra.b[w] = vb + bgra.b[w - stride1] & 255;
						w++;
						bgra.b[w] = vg + bgra.b[w - stride1] & 255;
						w++;
						bgra.b[w] = vr + bgra.b[w - stride1] & 255;
						w++;
						bgra.b[w] = va + bgra.b[w - stride1] & 255;
						w++;
					}
					break;
				case 3:
					var cr1 = 0;
					var cg1 = 0;
					var cb1 = 0;
					var ca1 = 0;
					var stride2;
					if(y == 0) stride2 = 0; else stride2 = width * 4;
					var _g33 = 0;
					while(_g33 < width) {
						var x3 = _g33++;
						var c4 = data.get(r++);
						vr = pal.b[c4 * 3];
						vg = pal.b[c4 * 3 + 1];
						vb = pal.b[c4 * 3 + 2];
						if(alpha != null) va = alpha.b[c4];
						cb1 = vb + (cb1 + bgra.b[w - stride2] >> 1) & 255;
						bgra.set(w++,cb1);
						cg1 = vg + (cg1 + bgra.b[w - stride2] >> 1) & 255;
						bgra.set(w++,cg1);
						cr1 = vr + (cr1 + bgra.b[w - stride2] >> 1) & 255;
						bgra.set(w++,cr1);
						cr1 = va + (ca1 + bgra.b[w - stride2] >> 1) & 255;
						bgra.set(w++,ca1);
					}
					break;
				case 4:
					var stride3 = width * 4;
					var cr2 = 0;
					var cg2 = 0;
					var cb2 = 0;
					var ca2 = 0;
					var _g34 = 0;
					while(_g34 < width) {
						var x4 = _g34++;
						var c5 = data.get(r++);
						vr = pal.b[c5 * 3];
						vg = pal.b[c5 * 3 + 1];
						vb = pal.b[c5 * 3 + 2];
						if(alpha != null) va = alpha.b[c5];
						cb2 = format.png.Tools.filter(bgra,x4,y,stride3,cb2,w,null) + vb & 255;
						bgra.set(w++,cb2);
						cg2 = format.png.Tools.filter(bgra,x4,y,stride3,cg2,w,null) + vg & 255;
						bgra.set(w++,cg2);
						cr2 = format.png.Tools.filter(bgra,x4,y,stride3,cr2,w,null) + vr & 255;
						bgra.set(w++,cr2);
						ca2 = format.png.Tools.filter(bgra,x4,y,stride3,ca2,w,null) + va & 255;
						bgra.set(w++,ca2);
					}
					break;
				default:
					throw "Invalid filter " + f;
				}
			}
			break;
		case 0:
			var alpha1 = _g[2];
			if(h.colbits != 8) throw "Unsupported color mode";
			var width1 = h.width;
			var stride4;
			stride4 = (alpha1?2:1) * width1 + 1;
			if(data.length < h.height * stride4) throw "Not enough data";
			var _g21 = 0;
			var _g11 = h.height;
			while(_g21 < _g11) {
				var y1 = _g21++;
				var f1 = data.get(r++);
				switch(f1) {
				case 0:
					if(alpha1) {
						var _g35 = 0;
						while(_g35 < width1) {
							var x5 = _g35++;
							var v = data.get(r++);
							bgra.set(w++,v);
							bgra.set(w++,v);
							bgra.set(w++,v);
							bgra.set(w++,data.get(r++));
						}
					} else {
						var _g36 = 0;
						while(_g36 < width1) {
							var x6 = _g36++;
							var v1 = data.get(r++);
							bgra.set(w++,v1);
							bgra.set(w++,v1);
							bgra.set(w++,v1);
							bgra.set(w++,255);
						}
					}
					break;
				case 1:
					var cv = 0;
					var ca3 = 0;
					if(alpha1) {
						var _g37 = 0;
						while(_g37 < width1) {
							var x7 = _g37++;
							cv += data.get(r++);
							bgra.set(w++,cv);
							bgra.set(w++,cv);
							bgra.set(w++,cv);
							ca3 += data.get(r++);
							bgra.set(w++,ca3);
						}
					} else {
						var _g38 = 0;
						while(_g38 < width1) {
							var x8 = _g38++;
							cv += data.get(r++);
							bgra.set(w++,cv);
							bgra.set(w++,cv);
							bgra.set(w++,cv);
							bgra.set(w++,255);
						}
					}
					break;
				case 2:
					var stride5;
					if(y1 == 0) stride5 = 0; else stride5 = width1 * 4;
					if(alpha1) {
						var _g39 = 0;
						while(_g39 < width1) {
							var x9 = _g39++;
							var v2 = data.get(r++) + bgra.b[w - stride5];
							bgra.set(w++,v2);
							bgra.set(w++,v2);
							bgra.set(w++,v2);
							bgra.set(w++,data.get(r++) + bgra.b[w - stride5]);
						}
					} else {
						var _g310 = 0;
						while(_g310 < width1) {
							var x10 = _g310++;
							var v3 = data.get(r++) + bgra.b[w - stride5];
							bgra.set(w++,v3);
							bgra.set(w++,v3);
							bgra.set(w++,v3);
							bgra.set(w++,255);
						}
					}
					break;
				case 3:
					var cv1 = 0;
					var ca4 = 0;
					var stride6;
					if(y1 == 0) stride6 = 0; else stride6 = width1 * 4;
					if(alpha1) {
						var _g311 = 0;
						while(_g311 < width1) {
							var x11 = _g311++;
							cv1 = data.get(r++) + (cv1 + bgra.b[w - stride6] >> 1) & 255;
							bgra.set(w++,cv1);
							bgra.set(w++,cv1);
							bgra.set(w++,cv1);
							ca4 = data.get(r++) + (ca4 + bgra.b[w - stride6] >> 1) & 255;
							bgra.set(w++,ca4);
						}
					} else {
						var _g312 = 0;
						while(_g312 < width1) {
							var x12 = _g312++;
							cv1 = data.get(r++) + (cv1 + bgra.b[w - stride6] >> 1) & 255;
							bgra.set(w++,cv1);
							bgra.set(w++,cv1);
							bgra.set(w++,cv1);
							bgra.set(w++,255);
						}
					}
					break;
				case 4:
					var stride7 = width1 * 4;
					var cv2 = 0;
					var ca5 = 0;
					if(alpha1) {
						var _g313 = 0;
						while(_g313 < width1) {
							var x13 = _g313++;
							cv2 = format.png.Tools.filter(bgra,x13,y1,stride7,cv2,w,null) + data.get(r++) & 255;
							bgra.set(w++,cv2);
							bgra.set(w++,cv2);
							bgra.set(w++,cv2);
							ca5 = format.png.Tools.filter(bgra,x13,y1,stride7,ca5,w,null) + data.get(r++) & 255;
							bgra.set(w++,ca5);
						}
					} else {
						var _g314 = 0;
						while(_g314 < width1) {
							var x14 = _g314++;
							cv2 = format.png.Tools.filter(bgra,x14,y1,stride7,cv2,w,null) + data.get(r++) & 255;
							bgra.set(w++,cv2);
							bgra.set(w++,cv2);
							bgra.set(w++,cv2);
							bgra.set(w++,255);
						}
					}
					break;
				default:
					throw "Invalid filter " + f1;
				}
			}
			break;
		case 1:
			var alpha2 = _g[2];
			if(h.colbits != 8) throw "Unsupported color mode";
			var width2 = h.width;
			var stride8;
			stride8 = (alpha2?4:3) * width2 + 1;
			if(data.length < h.height * stride8) throw "Not enough data";
			var _g22 = 0;
			var _g12 = h.height;
			while(_g22 < _g12) {
				var y2 = _g22++;
				var f2 = data.get(r++);
				switch(f2) {
				case 0:
					if(alpha2) {
						var _g315 = 0;
						while(_g315 < width2) {
							var x15 = _g315++;
							bgra.set(w++,data.b[r + 2]);
							bgra.set(w++,data.b[r + 1]);
							bgra.set(w++,data.b[r]);
							bgra.set(w++,data.b[r + 3]);
							r += 4;
						}
					} else {
						var _g316 = 0;
						while(_g316 < width2) {
							var x16 = _g316++;
							bgra.set(w++,data.b[r + 2]);
							bgra.set(w++,data.b[r + 1]);
							bgra.set(w++,data.b[r]);
							bgra.set(w++,255);
							r += 3;
						}
					}
					break;
				case 1:
					var cr3 = 0;
					var cg3 = 0;
					var cb3 = 0;
					var ca6 = 0;
					if(alpha2) {
						var _g317 = 0;
						while(_g317 < width2) {
							var x17 = _g317++;
							cb3 += data.b[r + 2];
							bgra.set(w++,cb3);
							cg3 += data.b[r + 1];
							bgra.set(w++,cg3);
							cr3 += data.b[r];
							bgra.set(w++,cr3);
							ca6 += data.b[r + 3];
							bgra.set(w++,ca6);
							r += 4;
						}
					} else {
						var _g318 = 0;
						while(_g318 < width2) {
							var x18 = _g318++;
							cb3 += data.b[r + 2];
							bgra.set(w++,cb3);
							cg3 += data.b[r + 1];
							bgra.set(w++,cg3);
							cr3 += data.b[r];
							bgra.set(w++,cr3);
							bgra.set(w++,255);
							r += 3;
						}
					}
					break;
				case 2:
					var stride9;
					if(y2 == 0) stride9 = 0; else stride9 = width2 * 4;
					if(alpha2) {
						var _g319 = 0;
						while(_g319 < width2) {
							var x19 = _g319++;
							bgra.b[w] = data.b[r + 2] + bgra.b[w - stride9] & 255;
							w++;
							bgra.b[w] = data.b[r + 1] + bgra.b[w - stride9] & 255;
							w++;
							bgra.b[w] = data.b[r] + bgra.b[w - stride9] & 255;
							w++;
							bgra.b[w] = data.b[r + 3] + bgra.b[w - stride9] & 255;
							w++;
							r += 4;
						}
					} else {
						var _g320 = 0;
						while(_g320 < width2) {
							var x20 = _g320++;
							bgra.b[w] = data.b[r + 2] + bgra.b[w - stride9] & 255;
							w++;
							bgra.b[w] = data.b[r + 1] + bgra.b[w - stride9] & 255;
							w++;
							bgra.b[w] = data.b[r] + bgra.b[w - stride9] & 255;
							w++;
							bgra.set(w++,255);
							r += 3;
						}
					}
					break;
				case 3:
					var cr4 = 0;
					var cg4 = 0;
					var cb4 = 0;
					var ca7 = 0;
					var stride10;
					if(y2 == 0) stride10 = 0; else stride10 = width2 * 4;
					if(alpha2) {
						var _g321 = 0;
						while(_g321 < width2) {
							var x21 = _g321++;
							cb4 = data.b[r + 2] + (cb4 + bgra.b[w - stride10] >> 1) & 255;
							bgra.set(w++,cb4);
							cg4 = data.b[r + 1] + (cg4 + bgra.b[w - stride10] >> 1) & 255;
							bgra.set(w++,cg4);
							cr4 = data.b[r] + (cr4 + bgra.b[w - stride10] >> 1) & 255;
							bgra.set(w++,cr4);
							ca7 = data.b[r + 3] + (ca7 + bgra.b[w - stride10] >> 1) & 255;
							bgra.set(w++,ca7);
							r += 4;
						}
					} else {
						var _g322 = 0;
						while(_g322 < width2) {
							var x22 = _g322++;
							cb4 = data.b[r + 2] + (cb4 + bgra.b[w - stride10] >> 1) & 255;
							bgra.set(w++,cb4);
							cg4 = data.b[r + 1] + (cg4 + bgra.b[w - stride10] >> 1) & 255;
							bgra.set(w++,cg4);
							cr4 = data.b[r] + (cr4 + bgra.b[w - stride10] >> 1) & 255;
							bgra.set(w++,cr4);
							bgra.set(w++,255);
							r += 3;
						}
					}
					break;
				case 4:
					var stride11 = width2 * 4;
					var cr5 = 0;
					var cg5 = 0;
					var cb5 = 0;
					var ca8 = 0;
					if(alpha2) {
						var _g323 = 0;
						while(_g323 < width2) {
							var x23 = _g323++;
							cb5 = format.png.Tools.filter(bgra,x23,y2,stride11,cb5,w,null) + data.b[r + 2] & 255;
							bgra.set(w++,cb5);
							cg5 = format.png.Tools.filter(bgra,x23,y2,stride11,cg5,w,null) + data.b[r + 1] & 255;
							bgra.set(w++,cg5);
							cr5 = format.png.Tools.filter(bgra,x23,y2,stride11,cr5,w,null) + data.b[r] & 255;
							bgra.set(w++,cr5);
							ca8 = format.png.Tools.filter(bgra,x23,y2,stride11,ca8,w,null) + data.b[r + 3] & 255;
							bgra.set(w++,ca8);
							r += 4;
						}
					} else {
						var _g324 = 0;
						while(_g324 < width2) {
							var x24 = _g324++;
							cb5 = format.png.Tools.filter(bgra,x24,y2,stride11,cb5,w,null) + data.b[r + 2] & 255;
							bgra.set(w++,cb5);
							cg5 = format.png.Tools.filter(bgra,x24,y2,stride11,cg5,w,null) + data.b[r + 1] & 255;
							bgra.set(w++,cg5);
							cr5 = format.png.Tools.filter(bgra,x24,y2,stride11,cr5,w,null) + data.b[r] & 255;
							bgra.set(w++,cr5);
							bgra.set(w++,255);
							r += 3;
						}
					}
					break;
				default:
					throw "Invalid filter " + f2;
				}
			}
			break;
		}
	}
	return bgra;
};
format.tools = {};
format.tools.Adler32 = function() {
	this.a1 = 1;
	this.a2 = 0;
};
$hxClasses["format.tools.Adler32"] = format.tools.Adler32;
format.tools.Adler32.__name__ = true;
format.tools.Adler32.read = function(i) {
	var a = new format.tools.Adler32();
	var a2a = i.readByte();
	var a2b = i.readByte();
	var a1a = i.readByte();
	var a1b = i.readByte();
	a.a1 = a1a << 8 | a1b;
	a.a2 = a2a << 8 | a2b;
	return a;
};
format.tools.Adler32.prototype = {
	update: function(b,pos,len) {
		var a1 = this.a1;
		var a2 = this.a2;
		var _g1 = pos;
		var _g = pos + len;
		while(_g1 < _g) {
			var p = _g1++;
			var c = b.b[p];
			a1 = (a1 + c) % 65521;
			a2 = (a2 + a1) % 65521;
		}
		this.a1 = a1;
		this.a2 = a2;
	}
	,equals: function(a) {
		return a.a1 == this.a1 && a.a2 == this.a2;
	}
	,__class__: format.tools.Adler32
};
format.tools.Huffman = $hxClasses["format.tools.Huffman"] = { __ename__ : true, __constructs__ : ["Found","NeedBit","NeedBits"] };
format.tools.Huffman.Found = function(i) { var $x = ["Found",0,i]; $x.__enum__ = format.tools.Huffman; $x.toString = $estr; return $x; };
format.tools.Huffman.NeedBit = function(left,right) { var $x = ["NeedBit",1,left,right]; $x.__enum__ = format.tools.Huffman; $x.toString = $estr; return $x; };
format.tools.Huffman.NeedBits = function(n,table) { var $x = ["NeedBits",2,n,table]; $x.__enum__ = format.tools.Huffman; $x.toString = $estr; return $x; };
format.tools.Huffman.__empty_constructs__ = [];
format.tools.HuffTools = function() {
};
$hxClasses["format.tools.HuffTools"] = format.tools.HuffTools;
format.tools.HuffTools.__name__ = true;
format.tools.HuffTools.prototype = {
	treeDepth: function(t) {
		switch(t[1]) {
		case 0:
			return 0;
		case 2:
			throw "assert";
			break;
		case 1:
			var b = t[3];
			var a = t[2];
			var da = this.treeDepth(a);
			var db = this.treeDepth(b);
			return 1 + (da < db?da:db);
		}
	}
	,treeCompress: function(t) {
		var d = this.treeDepth(t);
		if(d == 0) return t;
		if(d == 1) switch(t[1]) {
		case 1:
			var b = t[3];
			var a = t[2];
			return format.tools.Huffman.NeedBit(this.treeCompress(a),this.treeCompress(b));
		default:
			throw "assert";
		}
		var size = 1 << d;
		var table = new Array();
		var _g = 0;
		while(_g < size) {
			var i = _g++;
			table.push(format.tools.Huffman.Found(-1));
		}
		this.treeWalk(table,0,0,d,t);
		return format.tools.Huffman.NeedBits(d,table);
	}
	,treeWalk: function(table,p,cd,d,t) {
		switch(t[1]) {
		case 1:
			var b = t[3];
			var a = t[2];
			if(d > 0) {
				this.treeWalk(table,p,cd + 1,d - 1,a);
				this.treeWalk(table,p | 1 << cd,cd + 1,d - 1,b);
			} else table[p] = this.treeCompress(t);
			break;
		default:
			table[p] = this.treeCompress(t);
		}
	}
	,treeMake: function(bits,maxbits,v,len) {
		if(len > maxbits) throw "Invalid huffman";
		var idx = v << 5 | len;
		if(bits.exists(idx)) return format.tools.Huffman.Found(bits.get(idx));
		v <<= 1;
		len += 1;
		return format.tools.Huffman.NeedBit(this.treeMake(bits,maxbits,v,len),this.treeMake(bits,maxbits,v | 1,len));
	}
	,make: function(lengths,pos,nlengths,maxbits) {
		var counts = new Array();
		var tmp = new Array();
		if(maxbits > 32) throw "Invalid huffman";
		var _g = 0;
		while(_g < maxbits) {
			var i = _g++;
			counts.push(0);
			tmp.push(0);
		}
		var _g1 = 0;
		while(_g1 < nlengths) {
			var i1 = _g1++;
			var p = lengths[i1 + pos];
			if(p >= maxbits) throw "Invalid huffman";
			counts[p]++;
		}
		var code = 0;
		var _g11 = 1;
		var _g2 = maxbits - 1;
		while(_g11 < _g2) {
			var i2 = _g11++;
			code = code + counts[i2] << 1;
			tmp[i2] = code;
		}
		var bits = new haxe.ds.IntMap();
		var _g3 = 0;
		while(_g3 < nlengths) {
			var i3 = _g3++;
			var l = lengths[i3 + pos];
			if(l != 0) {
				var n = tmp[l - 1];
				tmp[l - 1] = n + 1;
				bits.set(n << 5 | l,i3);
			}
		}
		return this.treeCompress(format.tools.Huffman.NeedBit(this.treeMake(bits,maxbits,0,1),this.treeMake(bits,maxbits,1,1)));
	}
	,__class__: format.tools.HuffTools
};
format.tools.Inflate = function() { };
$hxClasses["format.tools.Inflate"] = format.tools.Inflate;
format.tools.Inflate.__name__ = true;
format.tools.Inflate.run = function(bytes) {
	return format.tools.InflateImpl.run(new haxe.io.BytesInput(bytes));
};
format.tools._InflateImpl = {};
format.tools._InflateImpl.Window = function(hasCrc) {
	this.buffer = haxe.io.Bytes.alloc(65536);
	this.pos = 0;
	if(hasCrc) this.crc = new format.tools.Adler32();
};
$hxClasses["format.tools._InflateImpl.Window"] = format.tools._InflateImpl.Window;
format.tools._InflateImpl.Window.__name__ = true;
format.tools._InflateImpl.Window.prototype = {
	slide: function() {
		if(this.crc != null) this.crc.update(this.buffer,0,32768);
		var b = haxe.io.Bytes.alloc(65536);
		this.pos -= 32768;
		b.blit(0,this.buffer,32768,this.pos);
		this.buffer = b;
	}
	,addBytes: function(b,p,len) {
		if(this.pos + len > 65536) this.slide();
		this.buffer.blit(this.pos,b,p,len);
		this.pos += len;
	}
	,addByte: function(c) {
		if(this.pos == 65536) this.slide();
		this.buffer.b[this.pos] = c & 255;
		this.pos++;
	}
	,getLastChar: function() {
		return this.buffer.b[this.pos - 1];
	}
	,available: function() {
		return this.pos;
	}
	,checksum: function() {
		if(this.crc != null) this.crc.update(this.buffer,0,this.pos);
		return this.crc;
	}
	,__class__: format.tools._InflateImpl.Window
};
format.tools._InflateImpl.State = $hxClasses["format.tools._InflateImpl.State"] = { __ename__ : true, __constructs__ : ["Head","Block","CData","Flat","Crc","Dist","DistOne","Done"] };
format.tools._InflateImpl.State.Head = ["Head",0];
format.tools._InflateImpl.State.Head.toString = $estr;
format.tools._InflateImpl.State.Head.__enum__ = format.tools._InflateImpl.State;
format.tools._InflateImpl.State.Block = ["Block",1];
format.tools._InflateImpl.State.Block.toString = $estr;
format.tools._InflateImpl.State.Block.__enum__ = format.tools._InflateImpl.State;
format.tools._InflateImpl.State.CData = ["CData",2];
format.tools._InflateImpl.State.CData.toString = $estr;
format.tools._InflateImpl.State.CData.__enum__ = format.tools._InflateImpl.State;
format.tools._InflateImpl.State.Flat = ["Flat",3];
format.tools._InflateImpl.State.Flat.toString = $estr;
format.tools._InflateImpl.State.Flat.__enum__ = format.tools._InflateImpl.State;
format.tools._InflateImpl.State.Crc = ["Crc",4];
format.tools._InflateImpl.State.Crc.toString = $estr;
format.tools._InflateImpl.State.Crc.__enum__ = format.tools._InflateImpl.State;
format.tools._InflateImpl.State.Dist = ["Dist",5];
format.tools._InflateImpl.State.Dist.toString = $estr;
format.tools._InflateImpl.State.Dist.__enum__ = format.tools._InflateImpl.State;
format.tools._InflateImpl.State.DistOne = ["DistOne",6];
format.tools._InflateImpl.State.DistOne.toString = $estr;
format.tools._InflateImpl.State.DistOne.__enum__ = format.tools._InflateImpl.State;
format.tools._InflateImpl.State.Done = ["Done",7];
format.tools._InflateImpl.State.Done.toString = $estr;
format.tools._InflateImpl.State.Done.__enum__ = format.tools._InflateImpl.State;
format.tools._InflateImpl.State.__empty_constructs__ = [format.tools._InflateImpl.State.Head,format.tools._InflateImpl.State.Block,format.tools._InflateImpl.State.CData,format.tools._InflateImpl.State.Flat,format.tools._InflateImpl.State.Crc,format.tools._InflateImpl.State.Dist,format.tools._InflateImpl.State.DistOne,format.tools._InflateImpl.State.Done];
format.tools.InflateImpl = function(i,header,crc) {
	if(crc == null) crc = true;
	if(header == null) header = true;
	this["final"] = false;
	this.htools = new format.tools.HuffTools();
	this.huffman = this.buildFixedHuffman();
	this.huffdist = null;
	this.len = 0;
	this.dist = 0;
	if(header) this.state = format.tools._InflateImpl.State.Head; else this.state = format.tools._InflateImpl.State.Block;
	this.input = i;
	this.bits = 0;
	this.nbits = 0;
	this.needed = 0;
	this.output = null;
	this.outpos = 0;
	this.lengths = new Array();
	var _g = 0;
	while(_g < 19) {
		var i1 = _g++;
		this.lengths.push(-1);
	}
	this.window = new format.tools._InflateImpl.Window(crc);
};
$hxClasses["format.tools.InflateImpl"] = format.tools.InflateImpl;
format.tools.InflateImpl.__name__ = true;
format.tools.InflateImpl.run = function(i,bufsize) {
	if(bufsize == null) bufsize = 65536;
	var buf = haxe.io.Bytes.alloc(bufsize);
	var output = new haxe.io.BytesBuffer();
	var inflate = new format.tools.InflateImpl(i);
	while(true) {
		var len = inflate.readBytes(buf,0,bufsize);
		output.addBytes(buf,0,len);
		if(len < bufsize) break;
	}
	return output.getBytes();
};
format.tools.InflateImpl.prototype = {
	buildFixedHuffman: function() {
		if(format.tools.InflateImpl.FIXED_HUFFMAN != null) return format.tools.InflateImpl.FIXED_HUFFMAN;
		var a = new Array();
		var _g = 0;
		while(_g < 288) {
			var n = _g++;
			a.push(n <= 143?8:n <= 255?9:n <= 279?7:8);
		}
		format.tools.InflateImpl.FIXED_HUFFMAN = this.htools.make(a,0,288,10);
		return format.tools.InflateImpl.FIXED_HUFFMAN;
	}
	,readBytes: function(b,pos,len) {
		this.needed = len;
		this.outpos = pos;
		this.output = b;
		if(len > 0) while(this.inflateLoop()) {
		}
		return len - this.needed;
	}
	,getBits: function(n) {
		while(this.nbits < n) {
			this.bits |= this.input.readByte() << this.nbits;
			this.nbits += 8;
		}
		var b = this.bits & (1 << n) - 1;
		this.nbits -= n;
		this.bits >>= n;
		return b;
	}
	,getBit: function() {
		if(this.nbits == 0) {
			this.nbits = 8;
			this.bits = this.input.readByte();
		}
		var b = (this.bits & 1) == 1;
		this.nbits--;
		this.bits >>= 1;
		return b;
	}
	,getRevBits: function(n) {
		if(n == 0) return 0; else if(this.getBit()) return 1 << n - 1 | this.getRevBits(n - 1); else return this.getRevBits(n - 1);
	}
	,resetBits: function() {
		this.bits = 0;
		this.nbits = 0;
	}
	,addBytes: function(b,p,len) {
		this.window.addBytes(b,p,len);
		this.output.blit(this.outpos,b,p,len);
		this.needed -= len;
		this.outpos += len;
	}
	,addByte: function(b) {
		this.window.addByte(b);
		this.output.b[this.outpos] = b & 255;
		this.needed--;
		this.outpos++;
	}
	,addDistOne: function(n) {
		var c = this.window.getLastChar();
		var _g = 0;
		while(_g < n) {
			var i = _g++;
			this.addByte(c);
		}
	}
	,addDist: function(d,len) {
		this.addBytes(this.window.buffer,this.window.pos - d,len);
	}
	,applyHuffman: function(h) {
		switch(h[1]) {
		case 0:
			var n = h[2];
			return n;
		case 1:
			var b = h[3];
			var a = h[2];
			return this.applyHuffman(this.getBit()?b:a);
		case 2:
			var tbl = h[3];
			var n1 = h[2];
			return this.applyHuffman(tbl[this.getBits(n1)]);
		}
	}
	,inflateLengths: function(a,max) {
		var i = 0;
		var prev = 0;
		while(i < max) {
			var n = this.applyHuffman(this.huffman);
			switch(n) {
			case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:case 8:case 9:case 10:case 11:case 12:case 13:case 14:case 15:
				prev = n;
				a[i] = n;
				i++;
				break;
			case 16:
				var end = i + 3 + this.getBits(2);
				if(end > max) throw "Invalid data";
				while(i < end) {
					a[i] = prev;
					i++;
				}
				break;
			case 17:
				i += 3 + this.getBits(3);
				if(i > max) throw "Invalid data";
				break;
			case 18:
				i += 11 + this.getBits(7);
				if(i > max) throw "Invalid data";
				break;
			default:
				throw "Invalid data";
			}
		}
	}
	,inflateLoop: function() {
		var _g = this.state;
		switch(_g[1]) {
		case 0:
			var cmf = this.input.readByte();
			var cm = cmf & 15;
			var cinfo = cmf >> 4;
			if(cm != 8 || cinfo != 7) throw "Invalid data";
			var flg = this.input.readByte();
			var fdict = (flg & 32) != 0;
			if(((cmf << 8) + flg) % 31 != 0) throw "Invalid data";
			if(fdict) throw "Unsupported dictionary";
			this.state = format.tools._InflateImpl.State.Block;
			return true;
		case 4:
			var calc = this.window.checksum();
			if(calc == null) {
				this.state = format.tools._InflateImpl.State.Done;
				return true;
			}
			var crc = format.tools.Adler32.read(this.input);
			if(!calc.equals(crc)) throw "Invalid CRC";
			this.state = format.tools._InflateImpl.State.Done;
			return true;
		case 7:
			return false;
		case 1:
			this["final"] = this.getBit();
			var _g1 = this.getBits(2);
			switch(_g1) {
			case 0:
				this.len = this.input.readUInt16();
				var nlen = this.input.readUInt16();
				if(nlen != 65535 - this.len) throw "Invalid data";
				this.state = format.tools._InflateImpl.State.Flat;
				var r = this.inflateLoop();
				this.resetBits();
				return r;
			case 1:
				this.huffman = this.buildFixedHuffman();
				this.huffdist = null;
				this.state = format.tools._InflateImpl.State.CData;
				return true;
			case 2:
				var hlit = this.getBits(5) + 257;
				var hdist = this.getBits(5) + 1;
				var hclen = this.getBits(4) + 4;
				var _g2 = 0;
				while(_g2 < hclen) {
					var i = _g2++;
					this.lengths[format.tools.InflateImpl.CODE_LENGTHS_POS[i]] = this.getBits(3);
				}
				var _g21 = hclen;
				while(_g21 < 19) {
					var i1 = _g21++;
					this.lengths[format.tools.InflateImpl.CODE_LENGTHS_POS[i1]] = 0;
				}
				this.huffman = this.htools.make(this.lengths,0,19,8);
				var lengths = new Array();
				var _g3 = 0;
				var _g22 = hlit + hdist;
				while(_g3 < _g22) {
					var i2 = _g3++;
					lengths.push(0);
				}
				this.inflateLengths(lengths,hlit + hdist);
				this.huffdist = this.htools.make(lengths,hlit,hdist,16);
				this.huffman = this.htools.make(lengths,0,hlit,16);
				this.state = format.tools._InflateImpl.State.CData;
				return true;
			default:
				throw "Invalid data";
			}
			break;
		case 3:
			var rlen;
			if(this.len < this.needed) rlen = this.len; else rlen = this.needed;
			var bytes = this.input.read(rlen);
			this.len -= rlen;
			this.addBytes(bytes,0,rlen);
			if(this.len == 0) if(this["final"]) this.state = format.tools._InflateImpl.State.Crc; else this.state = format.tools._InflateImpl.State.Block;
			return this.needed > 0;
		case 6:
			var rlen1;
			if(this.len < this.needed) rlen1 = this.len; else rlen1 = this.needed;
			this.addDistOne(rlen1);
			this.len -= rlen1;
			if(this.len == 0) this.state = format.tools._InflateImpl.State.CData;
			return this.needed > 0;
		case 5:
			while(this.len > 0 && this.needed > 0) {
				var rdist;
				if(this.len < this.dist) rdist = this.len; else rdist = this.dist;
				var rlen2;
				if(this.needed < rdist) rlen2 = this.needed; else rlen2 = rdist;
				this.addDist(this.dist,rlen2);
				this.len -= rlen2;
			}
			if(this.len == 0) this.state = format.tools._InflateImpl.State.CData;
			return this.needed > 0;
		case 2:
			var n = this.applyHuffman(this.huffman);
			if(n < 256) {
				this.addByte(n);
				return this.needed > 0;
			} else if(n == 256) {
				if(this["final"]) this.state = format.tools._InflateImpl.State.Crc; else this.state = format.tools._InflateImpl.State.Block;
				return true;
			} else {
				n -= 257;
				var extra_bits = format.tools.InflateImpl.LEN_EXTRA_BITS_TBL[n];
				if(extra_bits == -1) throw "Invalid data";
				this.len = format.tools.InflateImpl.LEN_BASE_VAL_TBL[n] + this.getBits(extra_bits);
				var dist_code;
				if(this.huffdist == null) dist_code = this.getRevBits(5); else dist_code = this.applyHuffman(this.huffdist);
				extra_bits = format.tools.InflateImpl.DIST_EXTRA_BITS_TBL[dist_code];
				if(extra_bits == -1) throw "Invalid data";
				this.dist = format.tools.InflateImpl.DIST_BASE_VAL_TBL[dist_code] + this.getBits(extra_bits);
				if(this.dist > this.window.available()) throw "Invalid data";
				if(this.dist == 1) this.state = format.tools._InflateImpl.State.DistOne; else this.state = format.tools._InflateImpl.State.Dist;
				return true;
			}
			break;
		}
	}
	,__class__: format.tools.InflateImpl
};
var h2d = {};
h2d.Sprite = function(parent) {
	this.matA = 1;
	this.matB = 0;
	this.matC = 0;
	this.matD = 1;
	this.absX = 0;
	this.absY = 0;
	this.posChanged = true;
	this.x = 0;
	this.posChanged = true;
	this.y = 0;
	this.posChanged = true;
	this.scaleX = 1;
	this.posChanged = true;
	this.scaleY = 1;
	this.posChanged = true;
	this.rotation = 0;
	this.posChanged = false;
	this.visible = true;
	this.childs = [];
	if(parent != null) parent.addChild(this);
};
$hxClasses["h2d.Sprite"] = h2d.Sprite;
h2d.Sprite.__name__ = true;
h2d.Sprite.prototype = {
	getScene: function() {
		var p = this;
		while(p.parent != null) p = p.parent;
		if((p instanceof h2d.Scene)) return p; else return null;
	}
	,addChild: function(s) {
		this.addChildAt(s,this.childs.length);
	}
	,addChildAt: function(s,pos) {
		if(pos < 0) pos = 0;
		if(pos > this.childs.length) pos = this.childs.length;
		var p = this;
		while(p != null) {
			if(p == s) throw "Recursive addChild";
			p = p.parent;
		}
		if(s.parent != null) {
			var old = s.allocated;
			s.allocated = false;
			s.parent.removeChild(s);
			s.allocated = old;
		}
		this.childs.splice(pos,0,s);
		if(!this.allocated && s.allocated) s.onDelete();
		s.parent = this;
		s.posChanged = true;
		if(this.allocated) {
			if(!s.allocated) s.onAlloc(); else s.onParentChanged();
		}
	}
	,onParentChanged: function() {
	}
	,onAlloc: function() {
		this.allocated = true;
		var _g = 0;
		var _g1 = this.childs;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			c.onAlloc();
		}
	}
	,onDelete: function() {
		this.allocated = false;
		var _g = 0;
		var _g1 = this.childs;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			c.onDelete();
		}
	}
	,removeChild: function(s) {
		if(HxOverrides.remove(this.childs,s)) {
			if(s.allocated) s.onDelete();
			s.parent = null;
		}
	}
	,draw: function(ctx) {
	}
	,sync: function(ctx) {
		var changed = this.posChanged;
		if(changed) {
			this.calcAbsPos();
			this.posChanged = false;
		}
		this.lastFrame = ctx.frame;
		var p = 0;
		var len = this.childs.length;
		while(p < len) {
			var c = this.childs[p];
			if(c == null) break;
			if(c.lastFrame != ctx.frame) {
				if(changed) c.posChanged = true;
				c.sync(ctx);
			}
			if(this.childs[p] != c) {
				p = 0;
				len = this.childs.length;
			} else p++;
		}
	}
	,calcAbsPos: function() {
		if(this.parent == null) {
			var cr;
			var sr;
			if(this.rotation == 0) {
				cr = 1.;
				sr = 0.;
				this.matA = this.scaleX;
				this.matB = 0;
				this.matC = 0;
				this.matD = this.scaleY;
			} else {
				cr = Math.cos(this.rotation);
				sr = Math.sin(this.rotation);
				this.matA = this.scaleX * cr;
				this.matB = this.scaleX * sr;
				this.matC = this.scaleY * -sr;
				this.matD = this.scaleY * cr;
			}
			this.absX = this.x;
			this.absY = this.y;
		} else {
			if(this.rotation == 0) {
				this.matA = this.scaleX * this.parent.matA;
				this.matB = this.scaleX * this.parent.matB;
				this.matC = this.scaleY * this.parent.matC;
				this.matD = this.scaleY * this.parent.matD;
			} else {
				var cr1 = Math.cos(this.rotation);
				var sr1 = Math.sin(this.rotation);
				var tmpA = this.scaleX * cr1;
				var tmpB = this.scaleX * sr1;
				var tmpC = this.scaleY * -sr1;
				var tmpD = this.scaleY * cr1;
				this.matA = tmpA * this.parent.matA + tmpB * this.parent.matC;
				this.matB = tmpA * this.parent.matB + tmpB * this.parent.matD;
				this.matC = tmpC * this.parent.matA + tmpD * this.parent.matC;
				this.matD = tmpC * this.parent.matB + tmpD * this.parent.matD;
			}
			this.absX = this.x * this.parent.matA + this.y * this.parent.matC + this.parent.absX;
			this.absY = this.x * this.parent.matB + this.y * this.parent.matD + this.parent.absY;
		}
	}
	,drawRec: function(ctx) {
		if(!this.visible) return;
		if(this.posChanged) {
			this.calcAbsPos();
			var _g = 0;
			var _g1 = this.childs;
			while(_g < _g1.length) {
				var c = _g1[_g];
				++_g;
				c.posChanged = true;
			}
			this.posChanged = false;
		}
		this.draw(ctx);
		var _g2 = 0;
		var _g11 = this.childs;
		while(_g2 < _g11.length) {
			var c1 = _g11[_g2];
			++_g2;
			c1.drawRec(ctx);
		}
	}
	,__class__: h2d.Sprite
};
h2d.Drawable = function() { };
$hxClasses["h2d.Drawable"] = h2d.Drawable;
h2d.Drawable.__name__ = true;
h2d.Drawable.__super__ = h2d.Sprite;
h2d.Drawable.prototype = $extend(h2d.Sprite.prototype,{
	emitTile: function(ctx,tile) {
		if(tile == null) tile = new h2d.Tile(null,0,0,5,5);
		ctx.beginDrawBatch(this,tile.innerTex);
		var ax = this.absX + tile.dx * this.matA + tile.dy * this.matC;
		var ay = this.absY + tile.dx * this.matB + tile.dy * this.matD;
		var buf = ctx.buffer;
		var pos = ctx.bufPos;
		while(buf.length < pos + 32) buf.push(0.);
		var key = pos++;
		buf[key] = ax;
		var key1 = pos++;
		buf[key1] = ay;
		var key2 = pos++;
		buf[key2] = tile.u;
		var key3 = pos++;
		buf[key3] = tile.v;
		var key4 = pos++;
		buf[key4] = this.color.x;
		var key5 = pos++;
		buf[key5] = this.color.y;
		var key6 = pos++;
		buf[key6] = this.color.z;
		var key7 = pos++;
		buf[key7] = this.color.w;
		var tw = tile.width;
		var th = tile.height;
		var dx1 = tw * this.matA;
		var dy1 = tw * this.matB;
		var dx2 = th * this.matC;
		var dy2 = th * this.matD;
		var key8 = pos++;
		buf[key8] = ax + dx1;
		var key9 = pos++;
		buf[key9] = ay + dy1;
		var key10 = pos++;
		buf[key10] = tile.u2;
		var key11 = pos++;
		buf[key11] = tile.v;
		var key12 = pos++;
		buf[key12] = this.color.x;
		var key13 = pos++;
		buf[key13] = this.color.y;
		var key14 = pos++;
		buf[key14] = this.color.z;
		var key15 = pos++;
		buf[key15] = this.color.w;
		var key16 = pos++;
		buf[key16] = ax + dx2;
		var key17 = pos++;
		buf[key17] = ay + dy2;
		var key18 = pos++;
		buf[key18] = tile.u;
		var key19 = pos++;
		buf[key19] = tile.v2;
		var key20 = pos++;
		buf[key20] = this.color.x;
		var key21 = pos++;
		buf[key21] = this.color.y;
		var key22 = pos++;
		buf[key22] = this.color.z;
		var key23 = pos++;
		buf[key23] = this.color.w;
		var key24 = pos++;
		buf[key24] = ax + dx1 + dx2;
		var key25 = pos++;
		buf[key25] = ay + dy1 + dy2;
		var key26 = pos++;
		buf[key26] = tile.u2;
		var key27 = pos++;
		buf[key27] = tile.v2;
		var key28 = pos++;
		buf[key28] = this.color.x;
		var key29 = pos++;
		buf[key29] = this.color.y;
		var key30 = pos++;
		buf[key30] = this.color.z;
		var key31 = pos++;
		buf[key31] = this.color.w;
		ctx.bufPos = pos;
	}
	,__class__: h2d.Drawable
});
h2d.BlendMode = $hxClasses["h2d.BlendMode"] = { __ename__ : true, __constructs__ : ["Normal","None","Add","SoftAdd","Multiply","Erase"] };
h2d.BlendMode.Normal = ["Normal",0];
h2d.BlendMode.Normal.toString = $estr;
h2d.BlendMode.Normal.__enum__ = h2d.BlendMode;
h2d.BlendMode.None = ["None",1];
h2d.BlendMode.None.toString = $estr;
h2d.BlendMode.None.__enum__ = h2d.BlendMode;
h2d.BlendMode.Add = ["Add",2];
h2d.BlendMode.Add.toString = $estr;
h2d.BlendMode.Add.__enum__ = h2d.BlendMode;
h2d.BlendMode.SoftAdd = ["SoftAdd",3];
h2d.BlendMode.SoftAdd.toString = $estr;
h2d.BlendMode.SoftAdd.__enum__ = h2d.BlendMode;
h2d.BlendMode.Multiply = ["Multiply",4];
h2d.BlendMode.Multiply.toString = $estr;
h2d.BlendMode.Multiply.__enum__ = h2d.BlendMode;
h2d.BlendMode.Erase = ["Erase",5];
h2d.BlendMode.Erase.toString = $estr;
h2d.BlendMode.Erase.__enum__ = h2d.BlendMode;
h2d.BlendMode.__empty_constructs__ = [h2d.BlendMode.Normal,h2d.BlendMode.None,h2d.BlendMode.Add,h2d.BlendMode.SoftAdd,h2d.BlendMode.Multiply,h2d.BlendMode.Erase];
h2d.Interactive = function() {
	this.propagateEvents = false;
	this.cancelEvents = false;
};
$hxClasses["h2d.Interactive"] = h2d.Interactive;
h2d.Interactive.__name__ = true;
h2d.Interactive.__super__ = h2d.Drawable;
h2d.Interactive.prototype = $extend(h2d.Drawable.prototype,{
	onAlloc: function() {
		this.scene = this.getScene();
		if(this.scene != null) this.scene.addEventTarget(this);
		h2d.Drawable.prototype.onAlloc.call(this);
	}
	,draw: function(ctx) {
		if(this.backgroundColor != null) this.emitTile(ctx,h2d.Tile.fromColor(this.backgroundColor,this.width | 0,this.height | 0));
	}
	,onParentChanged: function() {
		if(this.scene != null) {
			this.scene.removeEventTarget(this);
			this.scene.addEventTarget(this);
		}
	}
	,calcAbsPos: function() {
		h2d.Drawable.prototype.calcAbsPos.call(this);
		if(this.scene != null && this.scene.currentOver == this) {
			var stage = hxd.Stage.getInstance();
			var e = new hxd.Event(hxd.EventKind.EMove,stage.get_mouseX(),stage.get_mouseY());
			this.scene.onEvent(e);
		}
	}
	,onDelete: function() {
		if(this.scene != null) {
			this.scene.removeEventTarget(this);
			if(this.scene.currentOver == this) {
				this.scene.currentOver = null;
				hxd.System.setCursor(hxd.Cursor.Default);
			}
			if(this.scene.currentFocus == this) this.scene.currentFocus = null;
		}
		h2d.Drawable.prototype.onDelete.call(this);
	}
	,checkBounds: function(e) {
		var _g = e.kind;
		switch(_g[1]) {
		case 4:case 1:case 6:case 7:
			return false;
		default:
			return true;
		}
	}
	,handleEvent: function(e) {
		if(this.isEllipse && this.checkBounds(e)) {
			var cx = this.width * 0.5;
			var cy = this.height * 0.5;
			var dx = (e.relX - cx) / cx;
			var dy = (e.relY - cy) / cy;
			if(dx * dx + dy * dy > 1) {
				e.cancel = true;
				return;
			}
		}
		if(this.propagateEvents) e.propagate = true;
		if(this.cancelEvents) e.cancel = true;
		var _g = e.kind;
		switch(_g[1]) {
		case 2:
			this.onMove(e);
			break;
		case 0:
			if(this.enableRightButton || e.button == 0) {
				this.isMouseDown = e.button;
				this.onPush(e);
			}
			break;
		case 1:
			if(this.enableRightButton || e.button == 0) {
				this.onRelease(e);
				if(this.isMouseDown == e.button) this.onClick(e);
			}
			this.isMouseDown = -1;
			break;
		case 3:
			hxd.System.setCursor(this.cursor);
			this.onOver(e);
			break;
		case 4:
			this.isMouseDown = -1;
			hxd.System.setCursor(hxd.Cursor.Default);
			this.onOut(e);
			break;
		case 5:
			this.onWheel(e);
			break;
		case 7:
			this.onFocusLost(e);
			if(!e.cancel && this.scene != null && this.scene.currentFocus == this) this.scene.currentFocus = null;
			break;
		case 6:
			this.onFocus(e);
			if(!e.cancel && this.scene != null) this.scene.currentFocus = this;
			break;
		case 9:
			this.onKeyUp(e);
			break;
		case 8:
			this.onKeyDown(e);
			break;
		}
	}
	,onOver: function(e) {
	}
	,onOut: function(e) {
	}
	,onPush: function(e) {
	}
	,onRelease: function(e) {
	}
	,onClick: function(e) {
	}
	,onMove: function(e) {
	}
	,onWheel: function(e) {
	}
	,onFocus: function(e) {
	}
	,onFocusLost: function(e) {
	}
	,onKeyUp: function(e) {
	}
	,onKeyDown: function(e) {
	}
	,__class__: h2d.Interactive
});
h2d.Layers = function(parent) {
	h2d.Sprite.call(this,parent);
	this.layers = [];
	this.layerCount = 0;
};
$hxClasses["h2d.Layers"] = h2d.Layers;
h2d.Layers.__name__ = true;
h2d.Layers.__super__ = h2d.Sprite;
h2d.Layers.prototype = $extend(h2d.Sprite.prototype,{
	addChild: function(s) {
		this.addChildAt(s,0);
	}
	,addChildAt: function(s,layer) {
		if(s.parent == this) {
			var old = s.allocated;
			s.allocated = false;
			this.removeChild(s);
			s.allocated = old;
		}
		while(layer >= this.layerCount) this.layers[this.layerCount++] = this.childs.length;
		h2d.Sprite.prototype.addChildAt.call(this,s,this.layers[layer]);
		var _g1 = layer;
		var _g = this.layerCount;
		while(_g1 < _g) {
			var i = _g1++;
			this.layers[i]++;
		}
	}
	,removeChild: function(s) {
		var _g1 = 0;
		var _g = this.childs.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.childs[i] == s) {
				this.childs.splice(i,1);
				if(s.allocated) s.onDelete();
				s.parent = null;
				var k = this.layerCount - 1;
				while(k >= 0 && this.layers[k] > i) {
					this.layers[k]--;
					k--;
				}
				break;
			}
		}
	}
	,__class__: h2d.Layers
});
h2d.RenderContext = function() {
	this.frame = 0;
	this.time = 0.;
	this.elapsedTime = 1. / hxd.Stage.getInstance().getFrameRate();
	var this1;
	this1 = new Array(0);
	this.buffer = this1;
	this.bufPos = 0;
	this.manager = new h3d.shader.Manager(["output.position","output.color"]);
	this.pass = new h3d.mat.Pass("",null);
	this.pass.depth(true,h3d.mat.Compare.Always);
	this.pass.set_culling(h3d.mat.Face.None);
	this.baseShader = new h3d.shader.Base2d();
	this.baseShader.zValue__ = 0.;
};
$hxClasses["h2d.RenderContext"] = h2d.RenderContext;
h2d.RenderContext.__name__ = true;
h2d.RenderContext.prototype = {
	begin: function() {
		this.texture = null;
		this.currentObj = null;
		this.bufPos = 0;
		this.stride = 0;
		if(this.compiledShader == null) this.initShaders([this.baseShader]);
		this.engine.selectShader(this.compiledShader);
		this.engine.selectMaterial(this.pass);
		this.engine.uploadShaderBuffers(this.buffers,0);
	}
	,initShaders: function(shaders) {
		this.currentShaders = shaders;
		this.compiledShader = this.manager.compileShaders(shaders);
		this.buffers = new h3d.shader.Buffers(this.compiledShader);
		this.manager.fillGlobals(this.buffers,this.compiledShader);
	}
	,end: function() {
		this.flush();
		this.texture = null;
		this.currentObj = null;
	}
	,flush: function(force) {
		if(force == null) force = false;
		if(this.bufPos == 0) return;
		this.beforeDraw();
		var nverts = this.bufPos / this.stride | 0;
		var tmp = new h3d.Buffer(nverts,this.stride,[h3d.BufferFlag.Quads,h3d.BufferFlag.Dynamic]);
		tmp.uploadVector(this.buffer,0,nverts);
		this.engine.renderQuadBuffer(tmp,null,null);
		tmp.dispose();
		this.bufPos = 0;
		this.texture = null;
	}
	,beforeDraw: function() {
		this.baseShader.texture__ = this.texture;
		this.texture.set_filter(this.currentObj.filter?h3d.mat.Filter.Linear:h3d.mat.Filter.Nearest);
		this.texture.set_wrap(this.currentObj.tileWrap?h3d.mat.Wrap.Repeat:h3d.mat.Wrap.Clamp);
		var _g = this.currentObj.blendMode;
		switch(_g[1]) {
		case 0:
			this.pass.blend(h3d.mat.Blend.SrcAlpha,h3d.mat.Blend.OneMinusSrcAlpha);
			break;
		case 1:
			this.pass.blend(h3d.mat.Blend.One,h3d.mat.Blend.Zero);
			break;
		case 2:
			this.pass.blend(h3d.mat.Blend.SrcAlpha,h3d.mat.Blend.One);
			break;
		case 3:
			this.pass.blend(h3d.mat.Blend.OneMinusDstColor,h3d.mat.Blend.One);
			break;
		case 4:
			this.pass.blend(h3d.mat.Blend.DstColor,h3d.mat.Blend.OneMinusSrcAlpha);
			break;
		case 5:
			this.pass.blend(h3d.mat.Blend.Zero,h3d.mat.Blend.OneMinusSrcAlpha);
			break;
		}
		this.manager.fillParams(this.buffers,this.compiledShader,this.currentShaders);
		this.engine.selectMaterial(this.pass);
		this.engine.uploadShaderBuffers(this.buffers,1);
		this.engine.uploadShaderBuffers(this.buffers,2);
	}
	,beginDrawBatch: function(obj,texture) {
		this.beginDraw(obj,texture,false);
	}
	,beginDraw: function(obj,texture,isRelative) {
		var stride = 8;
		if(this.currentObj != null && (texture != this.texture || stride != this.stride || obj.blendMode != this.currentObj.blendMode || obj.filter != this.currentObj.filter)) this.flush();
		var shaderChanged = false;
		var paramsChanged = false;
		if(obj.shaders.length + 1 != this.currentShaders.length) shaderChanged = true; else {
			var _g1 = 0;
			var _g = obj.shaders.length;
			while(_g1 < _g) {
				var i = _g1++;
				var s = obj.shaders[i];
				var t = this.currentShaders[i + 1];
				if(s == t) continue;
				paramsChanged = true;
				s.updateConstants(this.manager.globals);
				if(s.instance != t.instance) shaderChanged = true;
			}
		}
		if(this.baseShader.isRelative__ != isRelative) shaderChanged = true;
		if(shaderChanged) {
			this.flush();
			var ns = obj.shaders.slice();
			ns.unshift(this.baseShader);
			this.baseShader.set_isRelative(isRelative);
			this.initShaders(ns);
			this.engine.selectShader(this.compiledShader);
		} else if(paramsChanged) {
			this.flush();
			var _g11 = 0;
			var _g2 = obj.shaders.length;
			while(_g11 < _g2) {
				var i1 = _g11++;
				this.currentShaders[i1 + 1] = obj.shaders[i1];
			}
		}
		this.texture = texture;
		this.stride = stride;
		this.currentObj = obj;
	}
	,__class__: h2d.RenderContext
};
h3d.IDrawable = function() { };
$hxClasses["h3d.IDrawable"] = h3d.IDrawable;
h3d.IDrawable.__name__ = true;
h3d.IDrawable.prototype = {
	__class__: h3d.IDrawable
};
h2d.Scene = function() {
	h2d.Layers.call(this,null);
	var e = h3d.Engine.CURRENT;
	this.ctx = new h2d.RenderContext();
	this.width = e.width;
	this.height = e.height;
	this.interactive = new Array();
	this.pushList = new Array();
	this.eventListeners = new Array();
	this.stage = hxd.Stage.getInstance();
	this.posChanged = true;
};
$hxClasses["h2d.Scene"] = h2d.Scene;
h2d.Scene.__name__ = true;
h2d.Scene.__interfaces__ = [h3d.IDrawable];
h2d.Scene.__super__ = h2d.Layers;
h2d.Scene.prototype = $extend(h2d.Layers.prototype,{
	onAlloc: function() {
		this.stage.addEventTarget($bind(this,this.onEvent));
		h2d.Layers.prototype.onAlloc.call(this);
	}
	,onDelete: function() {
		this.stage.removeEventTarget($bind(this,this.onEvent));
		h2d.Layers.prototype.onDelete.call(this);
	}
	,onEvent: function(e) {
		if(this.pendingEvents != null) this.pendingEvents.push(e);
	}
	,screenXToLocal: function(mx) {
		return (mx - this.x) * this.width / (this.stage.get_width() * this.scaleX);
	}
	,screenYToLocal: function(my) {
		return (my - this.y) * this.height / (this.stage.get_height() * this.scaleY);
	}
	,dispatchListeners: function(event) {
		event.propagate = true;
		event.cancel = false;
		var _g = 0;
		var _g1 = this.eventListeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(event);
			if(!event.propagate) break;
		}
	}
	,emitEvent: function(event) {
		var x = event.relX;
		var y = event.relY;
		var rx = x * this.matA + y * this.matB + this.absX;
		var ry = x * this.matC + y * this.matD + this.absY;
		var r = this.height / this.width;
		var handled = false;
		var checkOver = false;
		var checkPush = false;
		var cancelFocus = false;
		var _g = event.kind;
		switch(_g[1]) {
		case 2:
			checkOver = true;
			break;
		case 0:
			cancelFocus = true;
			checkPush = true;
			break;
		case 1:
			checkPush = true;
			break;
		case 9:case 8:case 5:
			if(this.currentFocus != null) {
				this.currentFocus.handleEvent(event);
				if(!event.propagate) return;
			}
			break;
		default:
		}
		var _g1 = 0;
		var _g11 = this.interactive;
		while(_g1 < _g11.length) {
			var i = _g11[_g1];
			++_g1;
			var dx = rx - i.absX;
			var dy = ry - i.absY;
			var w1 = i.width * i.matA * r;
			var h1 = i.width * i.matC;
			var ky = h1 * dx - w1 * dy;
			if(ky < 0) continue;
			var w2 = i.height * i.matB * r;
			var h2 = i.height * i.matD;
			var kx = w2 * dy - h2 * dx;
			if(kx < 0) continue;
			var max = h1 * w2 - w1 * h2;
			if(ky >= max || kx * r >= max) continue;
			var visible = true;
			var p = i;
			while(p != null) {
				if(!p.visible) {
					visible = false;
					break;
				}
				p = p.parent;
			}
			if(!visible) continue;
			event.relX = kx * r / max * i.width;
			event.relY = ky / max * i.height;
			i.handleEvent(event);
			if(event.cancel) event.cancel = false; else if(checkOver) {
				if(this.currentOver != i) {
					var old = event.propagate;
					if(this.currentOver != null) {
						event.kind = hxd.EventKind.EOut;
						this.currentOver.handleEvent(event);
					}
					event.kind = hxd.EventKind.EOver;
					event.cancel = false;
					i.handleEvent(event);
					if(event.cancel) this.currentOver = null; else {
						this.currentOver = i;
						checkOver = false;
					}
					event.kind = hxd.EventKind.EMove;
					event.cancel = false;
					event.propagate = old;
				} else checkOver = false;
			} else {
				if(checkPush) {
					if(event.kind == hxd.EventKind.EPush) this.pushList.push(i); else HxOverrides.remove(this.pushList,i);
				}
				if(cancelFocus && i == this.currentFocus) cancelFocus = false;
			}
			if(event.propagate) {
				event.propagate = false;
				continue;
			}
			handled = true;
			break;
		}
		if(cancelFocus && this.currentFocus != null) {
			event.kind = hxd.EventKind.EFocusLost;
			this.currentFocus.handleEvent(event);
			event.kind = hxd.EventKind.EPush;
		}
		if(checkOver && this.currentOver != null) {
			event.kind = hxd.EventKind.EOut;
			this.currentOver.handleEvent(event);
			event.kind = hxd.EventKind.EMove;
			this.currentOver = null;
		}
		if(!handled) {
			if(event.kind == hxd.EventKind.EPush) this.pushList.push(null);
			this.dispatchListeners(event);
		}
	}
	,hasEvents: function() {
		return this.interactive.length > 0 || this.eventListeners.length > 0;
	}
	,checkEvents: function() {
		if(this.pendingEvents == null) {
			if(!this.hasEvents()) return;
			this.pendingEvents = new Array();
		}
		var old = this.pendingEvents;
		if(old.length == 0) return;
		this.pendingEvents = null;
		var _g = 0;
		while(_g < old.length) {
			var e = old[_g];
			++_g;
			var ox = e.relX;
			var oy = e.relY;
			e.relX = this.screenXToLocal(ox);
			e.relY = this.screenYToLocal(oy);
			if(this.currentDrag != null && (this.currentDrag.ref == null || this.currentDrag.ref == e.touchId)) {
				this.currentDrag.f(e);
				if(e.cancel) {
					e.relX = ox;
					e.relY = oy;
					continue;
				}
			}
			this.emitEvent(e);
			if(e.kind == hxd.EventKind.ERelease && this.pushList.length > 0) {
				e.relX = this.screenXToLocal(ox);
				e.relY = this.screenYToLocal(oy);
				var _g1 = 0;
				var _g2 = this.pushList;
				while(_g1 < _g2.length) {
					var i = _g2[_g1];
					++_g1;
					if(i == null) this.dispatchListeners(e); else {
						i.isMouseDown = -1;
						i.handleEvent(e);
					}
				}
				this.pushList = new Array();
			}
			e.relX = ox;
			e.relY = oy;
		}
		if(this.hasEvents()) this.pendingEvents = new Array();
	}
	,addEventTarget: function(i) {
		var level;
		var i1 = i;
		var lv = 0;
		while(i1 != null) {
			i1 = i1.parent;
			lv++;
		}
		level = lv;
		var _g1 = 0;
		var _g = this.interactive.length;
		while(_g1 < _g) {
			var index = _g1++;
			var i11 = i;
			var i2 = this.interactive[index];
			var lv1 = level;
			var lv2;
			var i3 = i2;
			var lv3 = 0;
			while(i3 != null) {
				i3 = i3.parent;
				lv3++;
			}
			lv2 = lv3;
			var p1 = i11;
			var p2 = i2;
			while(lv1 > lv2) {
				i11 = p1;
				p1 = p1.parent;
				lv1--;
			}
			while(lv2 > lv1) {
				i2 = p2;
				p2 = p2.parent;
				lv2--;
			}
			while(p1 != p2) {
				i11 = p1;
				p1 = p1.parent;
				i2 = p2;
				p2 = p2.parent;
			}
			if((function($this) {
				var $r;
				var id = -1;
				{
					var _g11 = 0;
					var _g2 = p1.childs.length;
					while(_g11 < _g2) {
						var k = _g11++;
						if(p1.childs[k] == i11) {
							id = k;
							break;
						}
					}
				}
				$r = id;
				return $r;
			}(this)) > (function($this) {
				var $r;
				var id1 = -1;
				{
					var _g12 = 0;
					var _g3 = p2.childs.length;
					while(_g12 < _g3) {
						var k1 = _g12++;
						if(p2.childs[k1] == i2) {
							id1 = k1;
							break;
						}
					}
				}
				$r = id1;
				return $r;
			}(this))) {
				this.interactive.splice(index,0,i);
				return;
			}
		}
		this.interactive.push(i);
	}
	,removeEventTarget: function(i) {
		var _g1 = 0;
		var _g = this.interactive.length;
		while(_g1 < _g) {
			var k = _g1++;
			if(this.interactive[k] == i) {
				this.interactive.splice(k,1);
				break;
			}
		}
	}
	,calcAbsPos: function() {
		this.matA = this.scaleX;
		this.matB = 0;
		this.matC = 0;
		this.matD = this.scaleY;
		this.absX = this.x;
		this.absY = this.y;
		var w = 2 / this.width;
		var h = -2 / this.height;
		this.absX = this.absX * w - 1;
		this.absY = this.absY * h + 1;
		var engine = h3d.Engine.CURRENT;
		this.absX += 1 / engine.width;
		this.absY += 1 / engine.height;
		this.matA *= w;
		this.matB *= h;
		this.matC *= w;
		this.matD *= h;
		if(this.rotation != 0) {
			var cr = Math.cos(this.rotation);
			var sr = Math.sin(this.rotation);
			var tmpA = this.matA * cr + this.matB * sr;
			var tmpB = this.matA * -sr + this.matB * cr;
			var tmpC = this.matC * cr + this.matD * sr;
			var tmpD = this.matC * -sr + this.matD * cr;
			var tmpX = this.absX * cr + this.absY * sr;
			var tmpY = this.absX * -sr + this.absY * cr;
			this.matA = tmpA;
			this.matB = tmpB;
			this.matC = tmpC;
			this.matD = tmpD;
			this.absX = tmpX;
			this.absY = tmpY;
		}
	}
	,setElapsedTime: function(v) {
		this.ctx.elapsedTime = v;
	}
	,render: function(engine) {
		this.ctx.engine = engine;
		this.ctx.frame++;
		this.ctx.time += this.ctx.elapsedTime;
		this.sync(this.ctx);
		if(this.childs.length == 0) return;
		this.ctx.begin();
		this.drawRec(this.ctx);
		this.ctx.end();
	}
	,sync: function(ctx) {
		if(!this.allocated) this.onAlloc();
		if(!this.fixedSize && (this.width != ctx.engine.width || this.height != ctx.engine.height)) {
			this.width = ctx.engine.width;
			this.height = ctx.engine.height;
			this.posChanged = true;
		}
		h2d.Layers.prototype.sync.call(this,ctx);
	}
	,__class__: h2d.Scene
});
h2d.Tile = function(tex,x,y,w,h,dx,dy) {
	if(dy == null) dy = 0;
	if(dx == null) dx = 0;
	this.innerTex = tex;
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
	this.dx = dx;
	this.dy = dy;
	if(tex != null) this.setTexture(tex);
};
$hxClasses["h2d.Tile"] = h2d.Tile;
h2d.Tile.__name__ = true;
h2d.Tile.fromColor = function(color,width,height,allocPos) {
	if(height == null) height = 1;
	if(width == null) width = 1;
	var t = new h2d.Tile(h3d.mat.Texture.fromColor(color,allocPos),0,0,1,1);
	t.width = width;
	t.height = height;
	return t;
};
h2d.Tile.prototype = {
	setTexture: function(tex) {
		this.innerTex = tex;
		if(tex != null) {
			this.u = this.x / tex.width;
			this.v = this.y / tex.height;
			this.u2 = (this.x + this.width) / tex.width;
			this.v2 = (this.y + this.height - 0.0001) / tex.height;
		}
	}
	,__class__: h2d.Tile
};
h3d.prim = {};
h3d.prim.Primitive = function() { };
$hxClasses["h3d.prim.Primitive"] = h3d.prim.Primitive;
h3d.prim.Primitive.__name__ = true;
h3d.prim.Primitive.prototype = {
	triCount: function() {
		if(this.indexes != null) return this.indexes.count / 3 | 0; else if(this.buffer == null) return 0; else return Std["int"](this.buffer.totalVertices() / 3);
	}
	,alloc: function(engine) {
		throw "not implemented";
	}
	,render: function(engine) {
		if(this.buffer == null || this.buffer.isDisposed()) this.alloc(engine);
		if(this.indexes == null) engine.renderBuffer(this.buffer,engine.mem.triIndexes,3,0,-1); else engine.renderIndexed(this.buffer,this.indexes);
	}
	,dispose: function() {
		if(this.buffer != null) {
			this.buffer.dispose();
			this.buffer = null;
		}
		if(this.indexes != null) {
			this.indexes.dispose();
			this.indexes = null;
		}
	}
	,__class__: h3d.prim.Primitive
};
h3d.BufferFlag = $hxClasses["h3d.BufferFlag"] = { __ename__ : true, __constructs__ : ["Dynamic","Triangles","Quads","Managed","NoAlloc"] };
h3d.BufferFlag.Dynamic = ["Dynamic",0];
h3d.BufferFlag.Dynamic.toString = $estr;
h3d.BufferFlag.Dynamic.__enum__ = h3d.BufferFlag;
h3d.BufferFlag.Triangles = ["Triangles",1];
h3d.BufferFlag.Triangles.toString = $estr;
h3d.BufferFlag.Triangles.__enum__ = h3d.BufferFlag;
h3d.BufferFlag.Quads = ["Quads",2];
h3d.BufferFlag.Quads.toString = $estr;
h3d.BufferFlag.Quads.__enum__ = h3d.BufferFlag;
h3d.BufferFlag.Managed = ["Managed",3];
h3d.BufferFlag.Managed.toString = $estr;
h3d.BufferFlag.Managed.__enum__ = h3d.BufferFlag;
h3d.BufferFlag.NoAlloc = ["NoAlloc",4];
h3d.BufferFlag.NoAlloc.toString = $estr;
h3d.BufferFlag.NoAlloc.__enum__ = h3d.BufferFlag;
h3d.BufferFlag.__empty_constructs__ = [h3d.BufferFlag.Dynamic,h3d.BufferFlag.Triangles,h3d.BufferFlag.Quads,h3d.BufferFlag.Managed,h3d.BufferFlag.NoAlloc];
h3d.Buffer = function(vertices,stride,flags) {
	this.id = h3d.Buffer.GUID++;
	this.vertices = vertices;
	this.flags = 0;
	if(flags != null) {
		var _g = 0;
		while(_g < flags.length) {
			var f = flags[_g];
			++_g;
			this.flags |= 1 << f[1];
		}
	}
	if((this.flags & 1 << h3d.BufferFlag.Quads[1]) != 0 || (this.flags & 1 << h3d.BufferFlag.Triangles[1]) != 0) this.flags |= 1 << h3d.BufferFlag.Managed[1];
	if(!((this.flags & 1 << h3d.BufferFlag.NoAlloc[1]) != 0)) h3d.Engine.CURRENT.mem.allocBuffer(this,stride);
};
$hxClasses["h3d.Buffer"] = h3d.Buffer;
h3d.Buffer.__name__ = true;
h3d.Buffer.ofFloats = function(v,stride,flags,vertices) {
	var nvert;
	if(vertices == null) nvert = v.length / stride | 0; else nvert = vertices;
	var b = new h3d.Buffer(nvert,stride,flags);
	b.uploadVector(v,0,nvert);
	return b;
};
h3d.Buffer.prototype = {
	isDisposed: function() {
		return this.buffer == null || this.buffer.vbuf == null;
	}
	,dispose: function() {
		if(this.buffer != null) {
			this.buffer.freeBuffer(this);
			this.buffer = null;
			if(this.next != null) this.next.dispose();
		}
	}
	,totalVertices: function() {
		var count = 0;
		var b = this;
		while(b != null) {
			count += b.vertices;
			b = b.next;
		}
		return count;
	}
	,uploadVector: function(buf,bufPos,vertices) {
		var cur = this;
		while(vertices > 0) {
			if(cur == null) throw "Too many vertices";
			var count;
			if(vertices > cur.vertices) count = cur.vertices; else count = vertices;
			cur.buffer.uploadVertexBuffer(cur.position,count,buf,bufPos);
			bufPos += count * this.buffer.stride;
			vertices -= count;
			cur = cur.next;
		}
	}
	,uploadBytes: function(data,dataPos,vertices) {
		var cur = this;
		while(vertices > 0) {
			if(cur == null) throw "Too many vertices";
			var count;
			if(vertices > cur.vertices) count = cur.vertices; else count = vertices;
			cur.buffer.uploadVertexBytes(cur.position,count,data,dataPos);
			dataPos += count * this.buffer.stride * 4;
			vertices -= count;
			cur = cur.next;
		}
	}
	,__class__: h3d.Buffer
};
h3d.BufferOffset = function(buffer,offset) {
	this.id = h3d.BufferOffset.UID++;
	this.buffer = buffer;
	this.offset = offset;
};
$hxClasses["h3d.BufferOffset"] = h3d.BufferOffset;
h3d.BufferOffset.__name__ = true;
h3d.BufferOffset.prototype = {
	dispose: function() {
		if(this.buffer != null) {
			this.buffer.dispose();
			this.buffer = null;
		}
		this.next = null;
	}
	,__class__: h3d.BufferOffset
};
h3d.Camera = function(fovX,zoom,screenRatio,zNear,zFar,rightHanded) {
	if(rightHanded == null) rightHanded = false;
	if(zFar == null) zFar = 4000.;
	if(zNear == null) zNear = 0.02;
	if(screenRatio == null) screenRatio = 1.333333;
	if(zoom == null) zoom = 1.;
	if(fovX == null) fovX = 60.;
	this.viewY = 0.;
	this.viewX = 0.;
	this.fovX = fovX;
	this.zoom = zoom;
	this.screenRatio = screenRatio;
	this.zNear = zNear;
	this.zFar = zFar;
	this.rightHanded = rightHanded;
	this.pos = new h3d.Vector(2,3,4);
	this.up = new h3d.Vector(0,0,1);
	this.target = new h3d.Vector(0,0,0);
	this.m = new h3d.Matrix();
	this.mcam = new h3d.Matrix();
	this.mproj = new h3d.Matrix();
	this.update();
};
$hxClasses["h3d.Camera"] = h3d.Camera;
h3d.Camera.__name__ = true;
h3d.Camera.prototype = {
	getInverseViewProj: function() {
		if(this.minv == null) this.minv = new h3d.Matrix();
		if(this.needInv) {
			this.minv.inverse(this.m);
			this.needInv = false;
		}
		return this.minv;
	}
	,update: function() {
		this.makeCameraMatrix(this.mcam);
		this.makeFrustumMatrix(this.mproj);
		this.m.multiply(this.mcam,this.mproj);
		this.needInv = true;
	}
	,makeCameraMatrix: function(m) {
		var az;
		if(this.rightHanded) az = this.pos.sub(this.target); else az = this.target.sub(this.pos);
		az.normalize();
		var ax = this.up.cross(az);
		ax.normalize();
		if(Math.sqrt(ax.x * ax.x + ax.y * ax.y + ax.z * ax.z) == 0) {
			ax.x = az.y;
			ax.y = az.z;
			ax.z = az.x;
		}
		var ay = new h3d.Vector(az.y * ax.z - az.z * ax.y,az.z * ax.x - az.x * ax.z,az.x * ax.y - az.y * ax.x,1);
		m._11 = ax.x;
		m._12 = ay.x;
		m._13 = az.x;
		m._14 = 0;
		m._21 = ax.y;
		m._22 = ay.y;
		m._23 = az.y;
		m._24 = 0;
		m._31 = ax.z;
		m._32 = ay.z;
		m._33 = az.z;
		m._34 = 0;
		m._41 = -ax.dot3(this.pos);
		m._42 = -ay.dot3(this.pos);
		m._43 = -az.dot3(this.pos);
		m._44 = 1;
	}
	,makeFrustumMatrix: function(m) {
		m.zero();
		var bounds = this.orthoBounds;
		if(bounds != null) {
			var w = 1 / (bounds.xMax - bounds.xMin);
			var h = 1 / (bounds.yMax - bounds.yMin);
			var d = 1 / (bounds.zMax - bounds.zMin);
			m._11 = 2 * w;
			m._22 = 2 * h;
			m._33 = d;
			m._41 = -(bounds.xMin + bounds.xMax) * w;
			m._42 = -(bounds.yMin + bounds.yMax) * h;
			m._43 = -bounds.zMin * d;
			m._44 = 1;
		} else {
			var scale = this.zoom / Math.tan(this.fovX * Math.PI / 360.0);
			m._11 = scale;
			m._22 = scale * this.screenRatio;
			m._33 = this.zFar / (this.zFar - this.zNear);
			m._34 = 1;
			m._43 = -(this.zNear * this.zFar) / (this.zFar - this.zNear);
		}
		m._11 += this.viewX * m._14;
		m._21 += this.viewX * m._24;
		m._31 += this.viewX * m._34;
		m._41 += this.viewX * m._44;
		m._12 += this.viewY * m._14;
		m._22 += this.viewY * m._24;
		m._32 += this.viewY * m._34;
		m._42 += this.viewY * m._44;
		if(this.rightHanded) {
			m._33 *= -1;
			m._34 *= -1;
		}
	}
	,__class__: h3d.Camera
};
h3d.Engine = function(hardware,aa) {
	if(aa == null) aa = 0;
	if(hardware == null) hardware = true;
	this.frameCount = 0;
	this.backgroundColor = -16777216;
	this.hardware = hardware;
	this.antiAlias = aa;
	this.autoResize = true;
	this.start();
};
$hxClasses["h3d.Engine"] = h3d.Engine;
h3d.Engine.__name__ = true;
h3d.Engine.prototype = {
	start: function() {
		this.set_fullScreen(!hxd.System.get_isWindowed());
		var stage = hxd.Stage.getInstance();
		this.realFps = stage.getFrameRate();
		this.lastTime = haxe.Timer.stamp();
		stage.addResizeEvent($bind(this,this.onStageResize));
		this.driver = new h3d.impl.GlDriver();
		if(h3d.Engine.CURRENT == null) h3d.Engine.CURRENT = this;
	}
	,init: function() {
		this.driver.init($bind(this,this.onCreate),!this.hardware);
	}
	,selectShader: function(shader) {
		if(this.driver.selectShader(shader)) this.shaderSwitches++;
	}
	,selectMaterial: function(pass) {
		this.driver.selectMaterial(pass);
	}
	,uploadShaderBuffers: function(buffers,which) {
		this.driver.uploadShaderBuffers(buffers,which);
	}
	,selectBuffer: function(buf) {
		if(buf.vbuf == null) return false;
		this.driver.selectBuffer(buf.vbuf);
		return true;
	}
	,renderQuadBuffer: function(b,start,max) {
		if(max == null) max = -1;
		if(start == null) start = 0;
		return this.renderBuffer(b,this.mem.quadIndexes,2,start,max);
	}
	,renderBuffer: function(b,indexes,vertPerTri,startTri,drawTri) {
		if(drawTri == null) drawTri = -1;
		if(startTri == null) startTri = 0;
		if(indexes.isDisposed()) return;
		do {
			var ntri = b.vertices / vertPerTri | 0;
			var pos = b.position / vertPerTri | 0;
			if(startTri > 0) {
				if(startTri >= ntri) {
					startTri -= ntri;
					b = b.next;
					continue;
				}
				pos += startTri;
				ntri -= startTri;
				startTri = 0;
			}
			if(drawTri >= 0) {
				if(drawTri == 0) return;
				drawTri -= ntri;
				if(drawTri < 0) {
					ntri += drawTri;
					drawTri = 0;
				}
			}
			if(ntri > 0 && this.selectBuffer(b.buffer)) {
				this.driver.draw(indexes.ibuf,pos * 3,ntri);
				this.drawTriangles += ntri;
				this.drawCalls++;
			}
			b = b.next;
		} while(b != null);
	}
	,renderIndexed: function(b,indexes,startTri,drawTri) {
		if(drawTri == null) drawTri = -1;
		if(startTri == null) startTri = 0;
		if(b.next != null) throw "Buffer is split";
		if(indexes.isDisposed()) return;
		var maxTri = indexes.count / 3 | 0;
		if(drawTri < 0) drawTri = maxTri - startTri;
		if(drawTri > 0 && this.selectBuffer(b.buffer)) {
			this.driver.draw(indexes.ibuf,startTri * 3,drawTri);
			this.drawTriangles += drawTri;
			this.drawCalls++;
		}
	}
	,renderMultiBuffers: function(buffers,indexes,startTri,drawTri) {
		if(drawTri == null) drawTri = -1;
		if(startTri == null) startTri = 0;
		var maxTri = indexes.count / 3 | 0;
		if(maxTri <= 0) return;
		this.driver.selectMultiBuffers(buffers);
		if(indexes.isDisposed()) return;
		if(drawTri < 0) drawTri = maxTri - startTri;
		if(drawTri > 0) {
			this.driver.draw(indexes.ibuf,startTri * 3,drawTri);
			this.drawTriangles += drawTri;
			this.drawCalls++;
		}
	}
	,set_debug: function(d) {
		this.debug = d;
		this.driver.setDebug(this.debug);
		return d;
	}
	,onCreate: function(disposed) {
		if(this.autoResize) {
			var stage = hxd.Stage.getInstance();
			this.width = stage.get_width();
			this.height = stage.get_height();
		}
		if(disposed) this.mem.onContextLost(); else {
			this.mem = new h3d.impl.MemoryManager(this.driver);
			this.mem.init();
		}
		this.hardware = this.driver.isHardware();
		this.set_debug(this.debug);
		this.set_fullScreen(this.fullScreen);
		this.resize(this.width,this.height);
		if(disposed) this.onContextLost(); else this.onReady();
	}
	,onContextLost: function() {
	}
	,onReady: function() {
	}
	,onStageResize: function() {
		if(this.autoResize && !this.driver.isDisposed()) {
			var stage = hxd.Stage.getInstance();
			var w = stage.get_width();
			var h = stage.get_height();
			if(w != this.width || h != this.height) this.resize(w,h);
			this.onResized();
		}
	}
	,set_fullScreen: function(v) {
		this.fullScreen = v;
		if(this.mem != null && hxd.System.get_isWindowed()) hxd.Stage.getInstance().setFullScreen(v);
		return v;
	}
	,onResized: function() {
	}
	,resize: function(width,height) {
		if(width < 32) width = 32;
		if(height < 32) height = 32;
		this.width = width;
		this.height = height;
		if(!this.driver.isDisposed()) this.driver.resize(width,height);
	}
	,begin: function() {
		if(this.driver.isDisposed()) return false;
		this.driver.clear((this.backgroundColor >> 16 & 255) / 255,(this.backgroundColor >> 8 & 255) / 255,(this.backgroundColor & 255) / 255,(this.backgroundColor >>> 24 & 255) / 255);
		this.frameCount++;
		this.drawTriangles = 0;
		this.shaderSwitches = 0;
		this.drawCalls = 0;
		this.curProjMatrix = null;
		this.currentTarget = null;
		this.driver.begin(this.frameCount);
		return true;
	}
	,reset: function() {
		this.driver.reset();
	}
	,end: function() {
		this.driver.present();
		this.reset();
		this.curProjMatrix = null;
	}
	,getTarget: function() {
		return this.currentTarget;
	}
	,setTarget: function(tex,clearColor) {
		if(clearColor == null) clearColor = 0;
		this.currentTarget = tex;
		this.driver.setRenderTarget(tex,clearColor);
	}
	,render: function(obj) {
		if(!this.begin()) return false;
		obj.render(this);
		this.end();
		var delta = haxe.Timer.stamp() - this.lastTime;
		this.lastTime += delta;
		if(delta > 0) {
			var curFps = 1. / delta;
			if(curFps > this.realFps * 2) curFps = this.realFps * 2; else if(curFps < this.realFps * 0.5) curFps = this.realFps * 0.5;
			var f = delta / .5;
			if(f > 0.3) f = 0.3;
			this.realFps = this.realFps * (1 - f) + curFps * f;
		}
		return true;
	}
	,__class__: h3d.Engine
	,__properties__: {set_fullScreen:"set_fullScreen",set_debug:"set_debug"}
};
h3d.Indexes = function(count) {
	this.mem = h3d.Engine.CURRENT.mem;
	this.count = count;
	this.mem.allocIndexes(this);
};
$hxClasses["h3d.Indexes"] = h3d.Indexes;
h3d.Indexes.__name__ = true;
h3d.Indexes.alloc = function(i) {
	var idx = new h3d.Indexes(i.length);
	idx.upload(i,0,i.length);
	return idx;
};
h3d.Indexes.prototype = {
	isDisposed: function() {
		return this.ibuf == null;
	}
	,upload: function(indexes,pos,count,bufferPos) {
		if(bufferPos == null) bufferPos = 0;
		this.mem.driver.uploadIndexesBuffer(this.ibuf,pos,count,indexes,bufferPos);
	}
	,dispose: function() {
		if(this.ibuf != null) this.mem.deleteIndexes(this);
	}
	,__class__: h3d.Indexes
};
h3d.Matrix = function() {
};
$hxClasses["h3d.Matrix"] = h3d.Matrix;
h3d.Matrix.__name__ = true;
h3d.Matrix.prototype = {
	zero: function() {
		this._11 = 0.0;
		this._12 = 0.0;
		this._13 = 0.0;
		this._14 = 0.0;
		this._21 = 0.0;
		this._22 = 0.0;
		this._23 = 0.0;
		this._24 = 0.0;
		this._31 = 0.0;
		this._32 = 0.0;
		this._33 = 0.0;
		this._34 = 0.0;
		this._41 = 0.0;
		this._42 = 0.0;
		this._43 = 0.0;
		this._44 = 0.0;
	}
	,identity: function() {
		this._11 = 1.0;
		this._12 = 0.0;
		this._13 = 0.0;
		this._14 = 0.0;
		this._21 = 0.0;
		this._22 = 1.0;
		this._23 = 0.0;
		this._24 = 0.0;
		this._31 = 0.0;
		this._32 = 0.0;
		this._33 = 1.0;
		this._34 = 0.0;
		this._41 = 0.0;
		this._42 = 0.0;
		this._43 = 0.0;
		this._44 = 1.0;
	}
	,multiply3x4: function(a,b) {
		var m11 = a._11;
		var m12 = a._12;
		var m13 = a._13;
		var m21 = a._21;
		var m22 = a._22;
		var m23 = a._23;
		var a31 = a._31;
		var a32 = a._32;
		var a33 = a._33;
		var a41 = a._41;
		var a42 = a._42;
		var a43 = a._43;
		var b11 = b._11;
		var b12 = b._12;
		var b13 = b._13;
		var b21 = b._21;
		var b22 = b._22;
		var b23 = b._23;
		var b31 = b._31;
		var b32 = b._32;
		var b33 = b._33;
		var b41 = b._41;
		var b42 = b._42;
		var b43 = b._43;
		this._11 = m11 * b11 + m12 * b21 + m13 * b31;
		this._12 = m11 * b12 + m12 * b22 + m13 * b32;
		this._13 = m11 * b13 + m12 * b23 + m13 * b33;
		this._14 = 0;
		this._21 = m21 * b11 + m22 * b21 + m23 * b31;
		this._22 = m21 * b12 + m22 * b22 + m23 * b32;
		this._23 = m21 * b13 + m22 * b23 + m23 * b33;
		this._24 = 0;
		this._31 = a31 * b11 + a32 * b21 + a33 * b31;
		this._32 = a31 * b12 + a32 * b22 + a33 * b32;
		this._33 = a31 * b13 + a32 * b23 + a33 * b33;
		this._34 = 0;
		this._41 = a41 * b11 + a42 * b21 + a43 * b31 + b41;
		this._42 = a41 * b12 + a42 * b22 + a43 * b32 + b42;
		this._43 = a41 * b13 + a42 * b23 + a43 * b33 + b43;
		this._44 = 1;
	}
	,multiply: function(a,b) {
		var a11 = a._11;
		var a12 = a._12;
		var a13 = a._13;
		var a14 = a._14;
		var a21 = a._21;
		var a22 = a._22;
		var a23 = a._23;
		var a24 = a._24;
		var a31 = a._31;
		var a32 = a._32;
		var a33 = a._33;
		var a34 = a._34;
		var a41 = a._41;
		var a42 = a._42;
		var a43 = a._43;
		var a44 = a._44;
		var b11 = b._11;
		var b12 = b._12;
		var b13 = b._13;
		var b14 = b._14;
		var b21 = b._21;
		var b22 = b._22;
		var b23 = b._23;
		var b24 = b._24;
		var b31 = b._31;
		var b32 = b._32;
		var b33 = b._33;
		var b34 = b._34;
		var b41 = b._41;
		var b42 = b._42;
		var b43 = b._43;
		var b44 = b._44;
		this._11 = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
		this._12 = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
		this._13 = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
		this._14 = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
		this._21 = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
		this._22 = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
		this._23 = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
		this._24 = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
		this._31 = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
		this._32 = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
		this._33 = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
		this._34 = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
		this._41 = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
		this._42 = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
		this._43 = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
		this._44 = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
	}
	,inverse3x4: function(m) {
		var m11 = m._11;
		var m12 = m._12;
		var m13 = m._13;
		var m21 = m._21;
		var m22 = m._22;
		var m23 = m._23;
		var m31 = m._31;
		var m32 = m._32;
		var m33 = m._33;
		var m41 = m._41;
		var m42 = m._42;
		var m43 = m._43;
		this._11 = m22 * m33 - m23 * m32;
		this._12 = m13 * m32 - m12 * m33;
		this._13 = m12 * m23 - m13 * m22;
		this._14 = 0;
		this._21 = m23 * m31 - m21 * m33;
		this._22 = m11 * m33 - m13 * m31;
		this._23 = m13 * m21 - m11 * m23;
		this._24 = 0;
		this._31 = m21 * m32 - m22 * m31;
		this._32 = m12 * m31 - m11 * m32;
		this._33 = m11 * m22 - m12 * m21;
		this._34 = 0;
		this._41 = -m21 * m32 * m43 + m21 * m33 * m42 + m31 * m22 * m43 - m31 * m23 * m42 - m41 * m22 * m33 + m41 * m23 * m32;
		this._42 = m11 * m32 * m43 - m11 * m33 * m42 - m31 * m12 * m43 + m31 * m13 * m42 + m41 * m12 * m33 - m41 * m13 * m32;
		this._43 = -m11 * m22 * m43 + m11 * m23 * m42 + m21 * m12 * m43 - m21 * m13 * m42 - m41 * m12 * m23 + m41 * m13 * m22;
		this._44 = m11 * m22 * m33 - m11 * m23 * m32 - m21 * m12 * m33 + m21 * m13 * m32 + m31 * m12 * m23 - m31 * m13 * m22;
		this._44 = 1;
		var det = m11 * this._11 + m12 * this._21 + m13 * this._31;
		if((det < 0?-det:det) < 1e-10) {
			this.zero();
			return;
		}
		var invDet = 1.0 / det;
		this._11 *= invDet;
		this._12 *= invDet;
		this._13 *= invDet;
		this._21 *= invDet;
		this._22 *= invDet;
		this._23 *= invDet;
		this._31 *= invDet;
		this._32 *= invDet;
		this._33 *= invDet;
		this._41 *= invDet;
		this._42 *= invDet;
		this._43 *= invDet;
	}
	,inverse: function(m) {
		var m11 = m._11;
		var m12 = m._12;
		var m13 = m._13;
		var m14 = m._14;
		var m21 = m._21;
		var m22 = m._22;
		var m23 = m._23;
		var m24 = m._24;
		var m31 = m._31;
		var m32 = m._32;
		var m33 = m._33;
		var m34 = m._34;
		var m41 = m._41;
		var m42 = m._42;
		var m43 = m._43;
		var m44 = m._44;
		this._11 = m22 * m33 * m44 - m22 * m34 * m43 - m32 * m23 * m44 + m32 * m24 * m43 + m42 * m23 * m34 - m42 * m24 * m33;
		this._12 = -m12 * m33 * m44 + m12 * m34 * m43 + m32 * m13 * m44 - m32 * m14 * m43 - m42 * m13 * m34 + m42 * m14 * m33;
		this._13 = m12 * m23 * m44 - m12 * m24 * m43 - m22 * m13 * m44 + m22 * m14 * m43 + m42 * m13 * m24 - m42 * m14 * m23;
		this._14 = -m12 * m23 * m34 + m12 * m24 * m33 + m22 * m13 * m34 - m22 * m14 * m33 - m32 * m13 * m24 + m32 * m14 * m23;
		this._21 = -m21 * m33 * m44 + m21 * m34 * m43 + m31 * m23 * m44 - m31 * m24 * m43 - m41 * m23 * m34 + m41 * m24 * m33;
		this._22 = m11 * m33 * m44 - m11 * m34 * m43 - m31 * m13 * m44 + m31 * m14 * m43 + m41 * m13 * m34 - m41 * m14 * m33;
		this._23 = -m11 * m23 * m44 + m11 * m24 * m43 + m21 * m13 * m44 - m21 * m14 * m43 - m41 * m13 * m24 + m41 * m14 * m23;
		this._24 = m11 * m23 * m34 - m11 * m24 * m33 - m21 * m13 * m34 + m21 * m14 * m33 + m31 * m13 * m24 - m31 * m14 * m23;
		this._31 = m21 * m32 * m44 - m21 * m34 * m42 - m31 * m22 * m44 + m31 * m24 * m42 + m41 * m22 * m34 - m41 * m24 * m32;
		this._32 = -m11 * m32 * m44 + m11 * m34 * m42 + m31 * m12 * m44 - m31 * m14 * m42 - m41 * m12 * m34 + m41 * m14 * m32;
		this._33 = m11 * m22 * m44 - m11 * m24 * m42 - m21 * m12 * m44 + m21 * m14 * m42 + m41 * m12 * m24 - m41 * m14 * m22;
		this._34 = -m11 * m22 * m34 + m11 * m24 * m32 + m21 * m12 * m34 - m21 * m14 * m32 - m31 * m12 * m24 + m31 * m14 * m22;
		this._41 = -m21 * m32 * m43 + m21 * m33 * m42 + m31 * m22 * m43 - m31 * m23 * m42 - m41 * m22 * m33 + m41 * m23 * m32;
		this._42 = m11 * m32 * m43 - m11 * m33 * m42 - m31 * m12 * m43 + m31 * m13 * m42 + m41 * m12 * m33 - m41 * m13 * m32;
		this._43 = -m11 * m22 * m43 + m11 * m23 * m42 + m21 * m12 * m43 - m21 * m13 * m42 - m41 * m12 * m23 + m41 * m13 * m22;
		this._44 = m11 * m22 * m33 - m11 * m23 * m32 - m21 * m12 * m33 + m21 * m13 * m32 + m31 * m12 * m23 - m31 * m13 * m22;
		var det = m11 * this._11 + m12 * this._21 + m13 * this._31 + m14 * this._41;
		if((det < 0?-det:det) < 1e-10) {
			this.zero();
			return;
		}
		det = 1.0 / det;
		this._11 *= det;
		this._12 *= det;
		this._13 *= det;
		this._14 *= det;
		this._21 *= det;
		this._22 *= det;
		this._23 *= det;
		this._24 *= det;
		this._31 *= det;
		this._32 *= det;
		this._33 *= det;
		this._34 *= det;
		this._41 *= det;
		this._42 *= det;
		this._43 *= det;
		this._44 *= det;
	}
	,__class__: h3d.Matrix
};
h3d.Quat = function(x,y,z,w) {
	if(w == null) w = 1.;
	if(z == null) z = 0.;
	if(y == null) y = 0.;
	if(x == null) x = 0.;
	this.x = x;
	this.y = y;
	this.z = z;
	this.w = w;
};
$hxClasses["h3d.Quat"] = h3d.Quat;
h3d.Quat.__name__ = true;
h3d.Quat.prototype = {
	initRotateAxis: function(x,y,z,a) {
		var sin = Math.sin(a / 2);
		var cos = Math.cos(a / 2);
		this.x = x * sin;
		this.y = y * sin;
		this.z = z * sin;
		this.w = cos * Math.sqrt(x * x + y * y + z * z);
		this.normalize();
	}
	,normalize: function() {
		var len = this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
		if(len < 1e-10) {
			this.x = this.y = this.z = 0;
			this.w = 1;
		} else {
			var m = 1. / Math.sqrt(len);
			this.x *= m;
			this.y *= m;
			this.z *= m;
			this.w *= m;
		}
	}
	,initRotate: function(ax,ay,az) {
		var sinX = Math.sin(ax * 0.5);
		var cosX = Math.cos(ax * 0.5);
		var sinY = Math.sin(ay * 0.5);
		var cosY = Math.cos(ay * 0.5);
		var sinZ = Math.sin(az * 0.5);
		var cosZ = Math.cos(az * 0.5);
		var cosYZ = cosY * cosZ;
		var sinYZ = sinY * sinZ;
		this.x = sinX * cosYZ - cosX * sinYZ;
		this.y = cosX * sinY * cosZ + sinX * cosY * sinZ;
		this.z = cosX * cosY * sinZ - sinX * sinY * cosZ;
		this.w = cosX * cosYZ + sinX * sinYZ;
	}
	,multiply: function(q1,q2) {
		var x2 = q1.x * q2.w + q1.w * q2.x + q1.y * q2.z - q1.z * q2.y;
		var y2 = q1.w * q2.y - q1.x * q2.z + q1.y * q2.w + q1.z * q2.x;
		var z2 = q1.w * q2.z + q1.x * q2.y - q1.y * q2.x + q1.z * q2.w;
		var w2 = q1.w * q2.w - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z;
		this.x = x2;
		this.y = y2;
		this.z = z2;
		this.w = w2;
	}
	,saveToMatrix: function(m) {
		var xx = this.x * this.x;
		var xy = this.x * this.y;
		var xz = this.x * this.z;
		var xw = this.x * this.w;
		var yy = this.y * this.y;
		var yz = this.y * this.z;
		var yw = this.y * this.w;
		var zz = this.z * this.z;
		var zw = this.z * this.w;
		m._11 = 1 - 2 * (yy + zz);
		m._12 = 2 * (xy + zw);
		m._13 = 2 * (xz - yw);
		m._14 = 0;
		m._21 = 2 * (xy - zw);
		m._22 = 1 - 2 * (xx + zz);
		m._23 = 2 * (yz + xw);
		m._24 = 0;
		m._31 = 2 * (xz + yw);
		m._32 = 2 * (yz - xw);
		m._33 = 1 - 2 * (xx + yy);
		m._34 = 0;
		m._41 = 0;
		m._42 = 0;
		m._43 = 0;
		m._44 = 1;
		return m;
	}
	,__class__: h3d.Quat
};
h3d.Vector = function(x,y,z,w) {
	if(w == null) w = 1.;
	if(z == null) z = 0.;
	if(y == null) y = 0.;
	if(x == null) x = 0.;
	this.x = x;
	this.y = y;
	this.z = z;
	this.w = w;
};
$hxClasses["h3d.Vector"] = h3d.Vector;
h3d.Vector.__name__ = true;
h3d.Vector.prototype = {
	sub: function(v) {
		return new h3d.Vector(this.x - v.x,this.y - v.y,this.z - v.z,this.w - v.w);
	}
	,cross: function(v) {
		return new h3d.Vector(this.y * v.z - this.z * v.y,this.z * v.x - this.x * v.z,this.x * v.y - this.y * v.x,1);
	}
	,dot3: function(v) {
		return this.x * v.x + this.y * v.y + this.z * v.z;
	}
	,normalize: function() {
		var k = this.x * this.x + this.y * this.y + this.z * this.z;
		if(k < 1e-10) k = 0; else k = 1. / Math.sqrt(k);
		this.x *= k;
		this.y *= k;
		this.z *= k;
	}
	,set: function(x,y,z,w) {
		if(w == null) w = 1.;
		if(z == null) z = 0.;
		if(y == null) y = 0.;
		if(x == null) x = 0.;
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}
	,load: function(v) {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		this.w = v.w;
	}
	,__class__: h3d.Vector
};
h3d.anim = {};
h3d.anim._Animation = {};
h3d.anim._Animation.AnimWait = function() { };
$hxClasses["h3d.anim._Animation.AnimWait"] = h3d.anim._Animation.AnimWait;
h3d.anim._Animation.AnimWait.__name__ = true;
h3d.anim._Animation.AnimWait.prototype = {
	__class__: h3d.anim._Animation.AnimWait
};
h3d.anim.Animation = function() { };
$hxClasses["h3d.anim.Animation"] = h3d.anim.Animation;
h3d.anim.Animation.__name__ = true;
h3d.anim.Animation.prototype = {
	sync: function(decompose) {
		if(decompose == null) decompose = false;
		throw "assert";
	}
	,isPlaying: function() {
		return !this.pause && (this.speed < 0?-this.speed:this.speed) > 0.000001;
	}
	,endFrame: function() {
		return this.frameCount;
	}
	,update: function(dt) {
		if(!this.isInstance) throw "You must instanciate this animation first";
		if(!this.isPlaying()) return 0;
		var w = this.waits;
		var prev = null;
		while(w != null) {
			var wt = (w.frame - this.frame) / (this.speed * this.sampling);
			if(wt <= 0) {
				prev = w;
				w = w.next;
				continue;
			}
			if(wt > dt) break;
			this.frame = w.frame;
			dt -= wt;
			if(prev == null) this.waits = w.next; else prev.next = w.next;
			w.callb();
			return dt;
		}
		if(this.onAnimEnd != null) {
			var end = this.endFrame();
			var et = (end - this.frame) / (this.speed * this.sampling);
			if(et <= dt && et > 0) {
				this.frame = end;
				dt -= et;
				this.onAnimEnd();
				if(this.frame == end && this.isPlaying()) {
					if(this.loop) this.frame = 0; else dt = 0;
				}
				return dt;
			}
		}
		this.frame += dt * this.speed * this.sampling;
		if(this.frame >= this.frameCount) {
			if(this.loop) this.frame %= this.frameCount; else this.frame = this.frameCount;
		}
		return 0;
	}
	,__class__: h3d.anim.Animation
};
h3d.anim.Joint = function() { };
$hxClasses["h3d.anim.Joint"] = h3d.anim.Joint;
h3d.anim.Joint.__name__ = true;
h3d.anim.Skin = function() { };
$hxClasses["h3d.anim.Skin"] = h3d.anim.Skin;
h3d.anim.Skin.__name__ = true;
h3d.anim.Skin.prototype = {
	__class__: h3d.anim.Skin
};
h3d.col = {};
h3d.col.Bounds = function() {
	this.xMin = 1e20;
	this.xMax = -1e20;
	this.yMin = 1e20;
	this.yMax = -1e20;
	this.zMin = 1e20;
	this.zMax = -1e20;
};
$hxClasses["h3d.col.Bounds"] = h3d.col.Bounds;
h3d.col.Bounds.__name__ = true;
h3d.col.Bounds.prototype = {
	empty: function() {
		this.xMin = 1e20;
		this.xMax = -1e20;
		this.yMin = 1e20;
		this.yMax = -1e20;
		this.zMin = 1e20;
		this.zMax = -1e20;
	}
	,__class__: h3d.col.Bounds
};
h3d.col.Point = function(x,y,z) {
	if(z == null) z = 0.;
	if(y == null) y = 0.;
	if(x == null) x = 0.;
	this.x = x;
	this.y = y;
	this.z = z;
};
$hxClasses["h3d.col.Point"] = h3d.col.Point;
h3d.col.Point.__name__ = true;
h3d.col.Point.prototype = {
	cross: function(p) {
		return new h3d.col.Point(this.y * p.z - this.z * p.y,this.z * p.x - this.x * p.z,this.x * p.y - this.y * p.x);
	}
	,normalize: function() {
		var k = this.x * this.x + this.y * this.y + this.z * this.z;
		if(k < 1e-10) k = 0; else k = 1. / Math.sqrt(k);
		this.x *= k;
		this.y *= k;
		this.z *= k;
	}
	,clone: function() {
		return new h3d.col.Point(this.x,this.y,this.z);
	}
	,__class__: h3d.col.Point
};
h3d.impl = {};
h3d.impl.Feature = $hxClasses["h3d.impl.Feature"] = { __ename__ : true, __constructs__ : ["StandardDerivatives","FloatTextures","TargetDepthBuffer"] };
h3d.impl.Feature.StandardDerivatives = ["StandardDerivatives",0];
h3d.impl.Feature.StandardDerivatives.toString = $estr;
h3d.impl.Feature.StandardDerivatives.__enum__ = h3d.impl.Feature;
h3d.impl.Feature.FloatTextures = ["FloatTextures",1];
h3d.impl.Feature.FloatTextures.toString = $estr;
h3d.impl.Feature.FloatTextures.__enum__ = h3d.impl.Feature;
h3d.impl.Feature.TargetDepthBuffer = ["TargetDepthBuffer",2];
h3d.impl.Feature.TargetDepthBuffer.toString = $estr;
h3d.impl.Feature.TargetDepthBuffer.__enum__ = h3d.impl.Feature;
h3d.impl.Feature.__empty_constructs__ = [h3d.impl.Feature.StandardDerivatives,h3d.impl.Feature.FloatTextures,h3d.impl.Feature.TargetDepthBuffer];
h3d.impl.Driver = function() { };
$hxClasses["h3d.impl.Driver"] = h3d.impl.Driver;
h3d.impl.Driver.__name__ = true;
h3d.impl.Driver.prototype = {
	hasFeature: function(f) {
		return false;
	}
	,isDisposed: function() {
		return true;
	}
	,begin: function(frame) {
	}
	,clear: function(r,g,b,a) {
	}
	,reset: function() {
	}
	,init: function(onCreate,forceSoftware) {
		if(forceSoftware == null) forceSoftware = false;
	}
	,resize: function(width,height) {
	}
	,selectShader: function(shader) {
		return false;
	}
	,selectMaterial: function(pass) {
	}
	,uploadShaderBuffers: function(buffers,which) {
	}
	,getShaderInputNames: function() {
		return null;
	}
	,selectBuffer: function(buffer) {
	}
	,selectMultiBuffers: function(buffers) {
	}
	,draw: function(ibuf,startIndex,ntriangles) {
	}
	,setRenderTarget: function(tex,clearColor) {
	}
	,present: function() {
	}
	,isHardware: function() {
		return true;
	}
	,setDebug: function(b) {
	}
	,allocTexture: function(t) {
		return null;
	}
	,allocIndexes: function(count) {
		return null;
	}
	,allocVertex: function(m) {
		return null;
	}
	,disposeTexture: function(t) {
	}
	,disposeIndexes: function(i) {
	}
	,disposeVertex: function(v) {
	}
	,uploadIndexesBuffer: function(i,startIndice,indiceCount,buf,bufPos) {
	}
	,uploadVertexBuffer: function(v,startVertex,vertexCount,buf,bufPos) {
	}
	,uploadVertexBytes: function(v,startVertex,vertexCount,buf,bufPos) {
	}
	,uploadTextureBitmap: function(t,bmp,mipLevel,side) {
	}
	,uploadTexturePixels: function(t,pixels,mipLevel,side) {
	}
	,__class__: h3d.impl.Driver
};
h3d.impl._GlDriver = {};
h3d.impl._GlDriver.CompiledShader = function(s,vertex) {
	this.s = s;
	this.vertex = vertex;
};
$hxClasses["h3d.impl._GlDriver.CompiledShader"] = h3d.impl._GlDriver.CompiledShader;
h3d.impl._GlDriver.CompiledShader.__name__ = true;
h3d.impl._GlDriver.CompiledShader.prototype = {
	__class__: h3d.impl._GlDriver.CompiledShader
};
h3d.impl._GlDriver.CompiledProgram = function() {
};
$hxClasses["h3d.impl._GlDriver.CompiledProgram"] = h3d.impl._GlDriver.CompiledProgram;
h3d.impl._GlDriver.CompiledProgram.__name__ = true;
h3d.impl._GlDriver.CompiledProgram.prototype = {
	__class__: h3d.impl._GlDriver.CompiledProgram
};
h3d.impl.GlDriver = function() {
	this.canvas = hxd.Stage.getCanvas();
	if(this.canvas == null) throw "Canvas #webgl not found";
	this.gl = js.html._CanvasElement.CanvasUtil.getContextWebGL(this.canvas,{ alpha : false});
	if(this.gl == null) throw "Could not acquire GL context";
	if(typeof(WebGLDebugUtils) != "undefined") this.gl = WebGLDebugUtils.makeDebugContext(this.gl);
	this.programs = new haxe.ds.IntMap();
	this.curAttribs = 0;
	this.curMatBits = -1;
	this.selectMaterialBits(0);
};
$hxClasses["h3d.impl.GlDriver"] = h3d.impl.GlDriver;
h3d.impl.GlDriver.__name__ = true;
h3d.impl.GlDriver.__super__ = h3d.impl.Driver;
h3d.impl.GlDriver.prototype = $extend(h3d.impl.Driver.prototype,{
	begin: function(frame) {
		this.frame = frame;
		this.reset();
	}
	,reset: function() {
		this.gl.useProgram(null);
		this.curProgram = null;
		this.hasTargetFlip = false;
	}
	,getShaderInputNames: function() {
		return this.curProgram.attribNames;
	}
	,compileShader: function(glout,shader) {
		var type;
		if(shader.vertex) type = 35633; else type = 35632;
		var s = this.gl.createShader(type);
		var code = glout.run(shader.data);
		this.gl.shaderSource(s,code);
		this.gl.compileShader(s);
		if(this.gl.getShaderParameter(s,35713) != 1) {
			var log = this.gl.getShaderInfoLog(s);
			var line = code.split("\n")[Std.parseInt(HxOverrides.substr(log,9,null)) - 1];
			if(line == null) line = ""; else line = "(" + StringTools.trim(line) + ")";
			throw "An error occurred compiling the shaders: " + log + line;
		}
		return new h3d.impl._GlDriver.CompiledShader(s,shader.vertex);
	}
	,initShader: function(p,s,shader) {
		var prefix;
		if(s.vertex) prefix = "vertex"; else prefix = "fragment";
		s.globals = this.gl.getUniformLocation(p.p,prefix + "Globals");
		s.params = this.gl.getUniformLocation(p.p,prefix + "Params");
		var _g = [];
		var _g2 = 0;
		var _g1 = shader.textures.length;
		while(_g2 < _g1) {
			var i = _g2++;
			_g.push(this.gl.getUniformLocation(p.p,prefix + "Textures[" + i + "]"));
		}
		s.textures = _g;
	}
	,selectShader: function(shader) {
		var p = this.programs.get(shader.id);
		if(p == null) {
			p = new h3d.impl._GlDriver.CompiledProgram();
			var glout = new hxsl.GlslOut();
			p.vertex = this.compileShader(glout,shader.vertex);
			p.fragment = this.compileShader(glout,shader.fragment);
			p.p = this.gl.createProgram();
			this.gl.attachShader(p.p,p.vertex.s);
			this.gl.attachShader(p.p,p.fragment.s);
			this.gl.linkProgram(p.p);
			if(this.gl.getProgramParameter(p.p,35714) != 1) {
				var log = this.gl.getProgramInfoLog(p.p);
				throw "Program linkage failure: " + log;
			}
			this.initShader(p,p.vertex,shader.vertex);
			this.initShader(p,p.fragment,shader.fragment);
			p.attribNames = [];
			p.attribs = [];
			p.stride = 0;
			var _g = 0;
			var _g1 = shader.vertex.data.vars;
			while(_g < _g1.length) {
				var v = _g1[_g];
				++_g;
				var _g2 = v.kind;
				switch(_g2[1]) {
				case 1:
					var t = 5126;
					var size;
					{
						var _g3 = v.type;
						switch(_g3[1]) {
						case 5:
							var n = _g3[2];
							size = n;
							break;
						case 9:
							var n1 = _g3[2];
							t = 5120;
							size = n1;
							break;
						case 3:
							size = 1;
							break;
						default:
							throw "assert " + Std.string(v.type);
						}
					}
					p.attribs.push({ offset : p.stride, index : this.gl.getAttribLocation(p.p,glout.varNames.get(v.id)), size : size, type : t});
					p.attribNames.push(v.name);
					p.stride += size;
					break;
				default:
				}
			}
			this.programs.set(shader.id,p);
		}
		if(this.curProgram == p) return false;
		this.gl.useProgram(p.p);
		var _g11 = this.curAttribs;
		var _g4 = p.attribs.length;
		while(_g11 < _g4) {
			var i = _g11++;
			this.gl.enableVertexAttribArray(i);
			this.curAttribs++;
		}
		while(this.curAttribs > p.attribs.length) this.gl.disableVertexAttribArray(--this.curAttribs);
		this.curProgram = p;
		return true;
	}
	,uploadShaderBuffers: function(buf,which) {
		this.uploadBuffer(this.curProgram.vertex,buf.vertex,which);
		this.uploadBuffer(this.curProgram.fragment,buf.fragment,which);
	}
	,uploadBuffer: function(s,buf,which) {
		switch(which) {
		case 0:
			if(s.globals != null) this.gl.uniform4fv(s.globals,new Float32Array(buf.globals));
			break;
		case 1:
			if(s.params != null) this.gl.uniform4fv(s.params,new Float32Array(buf.params));
			break;
		case 2:
			var _g1 = 0;
			var _g = s.textures.length;
			while(_g1 < _g) {
				var i = _g1++;
				var t = buf.tex[i];
				if(t == null || t.t == null && t.realloc == null) t = h3d.mat.Texture.fromColor(-65281);
				if(t != null && t.t == null && t.realloc != null) {
					t.alloc();
					t.realloc();
				}
				t.lastFrame = this.frame;
				this.gl.activeTexture(33984 + i);
				this.gl.uniform1i(s.textures[i],i);
				this.gl.bindTexture(3553,t.t.t);
				var flags = h3d.impl.GlDriver.TFILTERS[t.mipMap[1]][t.filter[1]];
				this.gl.texParameteri(3553,10240,flags[0]);
				this.gl.texParameteri(3553,10241,flags[1]);
				var w = h3d.impl.GlDriver.TWRAP[t.wrap[1]];
				this.gl.texParameteri(3553,10242,w);
				this.gl.texParameteri(3553,10243,w);
			}
			break;
		}
	}
	,selectMaterial: function(pass) {
		this.selectMaterialBits(pass.bits);
	}
	,selectMaterialBits: function(bits) {
		if(this.hasTargetFlip) {
			var c = bits & 3;
			if(c == 1) c = 2; else if(c == 2) c = 1;
			bits = bits & -4 | c;
		}
		var diff = bits ^ this.curMatBits;
		if(diff == 0) return;
		if((diff & 3) != 0) {
			var cull = bits & 3;
			if(cull == 0) this.gl.disable(2884); else {
				if((this.curMatBits & 3) == 0) this.gl.enable(2884);
				this.gl.cullFace(h3d.impl.GlDriver.FACES[cull]);
			}
		}
		if((diff & 4194240) != 0) {
			var csrc = bits >> 6 & 15;
			var cdst = bits >> 10 & 15;
			var asrc = bits >> 14 & 15;
			var adst = bits >> 18 & 15;
			if(csrc == asrc && cdst == adst) {
				if(csrc == 0 && cdst == 1) this.gl.disable(3042); else {
					if(this.curMatBits < 0 || (this.curMatBits >> 6 & 15) == 0 && (this.curMatBits >> 10 & 15) == 1) this.gl.enable(3042);
					this.gl.blendFunc(h3d.impl.GlDriver.BLEND[csrc],h3d.impl.GlDriver.BLEND[cdst]);
				}
			} else {
				if(this.curMatBits < 0 || (this.curMatBits >> 6 & 15) == 0 && (this.curMatBits >> 10 & 15) == 1) this.gl.enable(3042);
				this.gl.blendFuncSeparate(h3d.impl.GlDriver.BLEND[csrc],h3d.impl.GlDriver.BLEND[cdst],h3d.impl.GlDriver.BLEND[asrc],h3d.impl.GlDriver.BLEND[adst]);
			}
		}
		if((diff & 62914560) != 0) {
			var cop = bits >> 22 & 3;
			var aop = bits >> 24 & 3;
			if(cop == aop) this.gl.blendEquation(h3d.impl.GlDriver.OP[cop]); else this.gl.blendEquationSeparate(h3d.impl.GlDriver.OP[cop],h3d.impl.GlDriver.OP[aop]);
		}
		if((diff & 4) != 0) this.gl.depthMask((bits >> 2 & 1) != 0);
		if((diff & 56) != 0) {
			var cmp = bits >> 3 & 7;
			if(cmp == 0) this.gl.disable(2929); else {
				if(this.curMatBits < 0 || (this.curMatBits >> 3 & 7) == 0) this.gl.enable(2929);
				this.gl.depthFunc(h3d.impl.GlDriver.COMPARE[cmp]);
			}
		}
		if((diff & 1006632960) != 0) {
			var m = bits >> 26 & 15;
			this.gl.colorMask((m & 1) != 0,(m & 2) != 0,(m & 4) != 0,(m & 8) != 0);
		}
		this.curMatBits = bits;
	}
	,clear: function(r,g,b,a) {
		this.gl.clearColor(r,g,b,a);
		this.gl.clearDepth(1);
		this.gl.clear(16640);
	}
	,resize: function(width,height) {
		if(this.canvas.style.width == "") {
			this.canvas.style.width = (width / window.devicePixelRatio | 0) + "px";
			this.canvas.style.height = (height / window.devicePixelRatio | 0) + "px";
		}
		this.canvas.width = width;
		this.canvas.height = height;
		this.gl.viewport(0,0,width,height);
	}
	,allocTexture: function(t) {
		var tt = this.gl.createTexture();
		var tt1 = { t : tt, width : t.width, height : t.height, fmt : 5121};
		if((t.flags & 1 << h3d.mat.TextureFlags.FmtFloat[1]) != 0) tt1.fmt = 5126; else if((t.flags & 1 << h3d.mat.TextureFlags.Fmt5_5_5_1[1]) != 0) tt1.fmt = 32820; else if((t.flags & 1 << h3d.mat.TextureFlags.Fmt5_6_5[1]) != 0) tt1.fmt = 33635; else if((t.flags & 1 << h3d.mat.TextureFlags.Fmt4_4_4_4[1]) != 0) tt1.fmt = 32819;
		t.lastFrame = this.frame;
		this.gl.bindTexture(3553,tt1.t);
		var mipMap;
		if((t.flags & 1 << h3d.mat.TextureFlags.MipMapped[1]) != 0) mipMap = 9985; else mipMap = 9729;
		this.gl.texParameteri(3553,10240,mipMap);
		this.gl.texParameteri(3553,10241,mipMap);
		this.gl.texImage2D(3553,0,6408,tt1.width,tt1.height,0,6408,tt1.fmt,null);
		if((t.flags & 1 << h3d.mat.TextureFlags.Target[1]) != 0) {
			var fb = this.gl.createFramebuffer();
			this.gl.bindFramebuffer(36160,fb);
			this.gl.framebufferTexture2D(36160,36064,3553,tt1.t,0);
			tt1.fb = fb;
			if((t.flags & 1 << h3d.mat.TextureFlags.TargetDepth[1]) != 0) {
				tt1.rb = this.gl.createRenderbuffer();
				this.gl.bindRenderbuffer(36161,tt1.rb);
				this.gl.renderbufferStorage(36161,33189,tt1.width,tt1.height);
				this.gl.framebufferRenderbuffer(36160,36096,36161,tt1.rb);
				this.gl.bindRenderbuffer(36161,null);
			}
			this.gl.bindFramebuffer(36160,null);
		}
		this.gl.bindTexture(3553,null);
		return tt1;
	}
	,allocVertex: function(m) {
		var b = this.gl.createBuffer();
		this.gl.bindBuffer(34962,b);
		if(m.size * m.stride == 0) throw "assert";
		this.gl.bufferData(34962,m.size * m.stride * 4,(m.flags & 1 << h3d.BufferFlag.Dynamic[1]) != 0?35048:35044);
		this.gl.bindBuffer(34962,null);
		return { b : b, stride : m.stride};
	}
	,allocIndexes: function(count) {
		var b = this.gl.createBuffer();
		this.gl.bindBuffer(34963,b);
		this.gl.bufferData(34963,count * 2,35044);
		this.gl.bindBuffer(34963,null);
		return b;
	}
	,disposeTexture: function(t) {
		this.gl.deleteTexture(t.t);
		if(t.rb != null) this.gl.deleteRenderbuffer(t.rb);
		if(t.fb != null) this.gl.deleteFramebuffer(t.fb);
	}
	,disposeIndexes: function(i) {
		this.gl.deleteBuffer(i);
	}
	,disposeVertex: function(v) {
		this.gl.deleteBuffer(v.b);
	}
	,uploadTextureBitmap: function(t,bmp,mipLevel,side) {
		var img = bmp;
		this.gl.bindTexture(3553,t.t.t);
		this.gl.texImage2D(3553,mipLevel,6408,6408,5121,img.getImageData(0,0,bmp.canvas.width,bmp.canvas.height));
		if((t.flags & 1 << h3d.mat.TextureFlags.MipMapped[1]) != 0) this.gl.generateMipmap(3553);
		this.gl.bindTexture(3553,null);
	}
	,uploadTexturePixels: function(t,pixels,mipLevel,side) {
		this.gl.bindTexture(3553,t.t.t);
		pixels.convert(hxd.PixelFormat.RGBA);
		var pixels1 = new Uint8Array(pixels.bytes.b);
		this.gl.texImage2D(3553,mipLevel,6408,t.width,t.height,0,6408,5121,pixels1);
		if((t.flags & 1 << h3d.mat.TextureFlags.MipMapped[1]) != 0) this.gl.generateMipmap(3553);
		this.gl.bindTexture(3553,null);
	}
	,uploadVertexBuffer: function(v,startVertex,vertexCount,buf,bufPos) {
		var stride = v.stride;
		var buf1 = new Float32Array(buf);
		var sub = new Float32Array(buf1.buffer,bufPos,vertexCount * stride);
		this.gl.bindBuffer(34962,v.b);
		this.gl.bufferSubData(34962,startVertex * stride * 4,sub);
		this.gl.bindBuffer(34962,null);
	}
	,uploadVertexBytes: function(v,startVertex,vertexCount,buf,bufPos) {
		var stride = v.stride;
		var buf1 = new Uint8Array(buf.b);
		var sub = new Uint8Array(buf1.buffer,bufPos,vertexCount * stride * 4);
		this.gl.bindBuffer(34962,v.b);
		this.gl.bufferSubData(34962,startVertex * stride * 4,sub);
		this.gl.bindBuffer(34962,null);
	}
	,uploadIndexesBuffer: function(i,startIndice,indiceCount,buf,bufPos) {
		var buf1 = new Uint16Array(buf);
		var sub = new Uint16Array(buf1.buffer,bufPos,indiceCount);
		this.gl.bindBuffer(34963,i);
		this.gl.bufferSubData(34963,startIndice * 2,sub);
		this.gl.bindBuffer(34963,null);
	}
	,selectBuffer: function(v) {
		var stride = v.stride;
		if(stride < this.curProgram.stride) throw "Buffer stride (" + stride + ") and shader stride (" + this.curProgram.stride + ") mismatch";
		this.gl.bindBuffer(34962,v.b);
		var _g = 0;
		var _g1 = this.curProgram.attribs;
		while(_g < _g1.length) {
			var a = _g1[_g];
			++_g;
			this.gl.vertexAttribPointer(a.index,a.size,a.type,false,stride * 4,a.offset * 4);
		}
	}
	,selectMultiBuffers: function(buffers) {
		var _g = 0;
		var _g1 = this.curProgram.attribs;
		while(_g < _g1.length) {
			var a = _g1[_g];
			++_g;
			this.gl.bindBuffer(34962,buffers.buffer.buffer.vbuf.b);
			this.gl.vertexAttribPointer(a.index,a.size,a.type,false,buffers.buffer.buffer.stride * 4,buffers.offset * 4);
			buffers = buffers.next;
		}
	}
	,draw: function(ibuf,startIndex,ntriangles) {
		this.gl.bindBuffer(34963,ibuf);
		this.gl.drawElements(4,ntriangles * 3,5123,startIndex * 2);
		this.gl.bindBuffer(34963,null);
	}
	,present: function() {
		this.gl.finish();
	}
	,isDisposed: function() {
		return this.gl.isContextLost();
	}
	,setRenderTarget: function(tex,clearColor) {
		if(tex == null) {
			this.gl.bindFramebuffer(36160,null);
			this.gl.viewport(0,0,this.canvas.width,this.canvas.height);
			this.hasTargetFlip = false;
			return;
		}
		if(tex.t == null) tex.alloc();
		tex.lastFrame = this.frame;
		this.hasTargetFlip = !((tex.flags & 1 << h3d.mat.TextureFlags.TargetNoFlipY[1]) != 0);
		this.gl.bindFramebuffer(36160,tex.t.fb);
		this.gl.viewport(0,0,tex.width,tex.height);
		this.clear((clearColor >> 16 & 255) / 255,(clearColor >> 8 & 255) / 255,(clearColor & 255) / 255,(clearColor >>> 24) / 255);
	}
	,init: function(onCreate,forceSoftware) {
		if(forceSoftware == null) forceSoftware = false;
		var ready = false;
		window.addEventListener("load",function(_) {
			if(!ready) {
				ready = true;
				onCreate(false);
			}
		});
	}
	,hasFeature: function(f) {
		switch(f[1]) {
		case 0:
			return this.gl.getExtension("OES_standard_derivatives") != null;
		case 1:
			return this.gl.getExtension("OES_texture_float") != null && this.gl.getExtension("OES_texture_float_linear") != null;
		case 2:
			return true;
		}
	}
	,__class__: h3d.impl.GlDriver
});
h3d.impl._ManagedBuffer = {};
h3d.impl._ManagedBuffer.FreeCell = function(pos,count,next) {
	this.pos = pos;
	this.count = count;
	this.next = next;
};
$hxClasses["h3d.impl._ManagedBuffer.FreeCell"] = h3d.impl._ManagedBuffer.FreeCell;
h3d.impl._ManagedBuffer.FreeCell.__name__ = true;
h3d.impl._ManagedBuffer.FreeCell.prototype = {
	__class__: h3d.impl._ManagedBuffer.FreeCell
};
h3d.impl.ManagedBuffer = function(stride,size,flags) {
	this.flags = 0;
	if(flags != null) {
		var _g = 0;
		while(_g < flags.length) {
			var f = flags[_g];
			++_g;
			this.flags |= 1 << f[1];
		}
	}
	this.mem = h3d.Engine.CURRENT.mem;
	this.size = size;
	this.stride = stride;
	this.freeList = new h3d.impl._ManagedBuffer.FreeCell(0,size,null);
	this.mem.allocManaged(this);
};
$hxClasses["h3d.impl.ManagedBuffer"] = h3d.impl.ManagedBuffer;
h3d.impl.ManagedBuffer.__name__ = true;
h3d.impl.ManagedBuffer.prototype = {
	uploadVertexBuffer: function(start,vertices,buf,bufPos) {
		if(bufPos == null) bufPos = 0;
		this.mem.driver.uploadVertexBuffer(this.vbuf,start,vertices,buf,bufPos);
	}
	,uploadVertexBytes: function(start,vertices,data,dataPos) {
		if(dataPos == null) dataPos = 0;
		this.mem.driver.uploadVertexBytes(this.vbuf,start,vertices,data,dataPos);
	}
	,allocPosition: function(nvert,align) {
		var free = this.freeList;
		while(free != null) {
			if(free.count >= nvert) {
				var d = (align - free.pos % align) % align;
				if(d == 0) break;
				if(free.count >= nvert + d) {
					free.next = new h3d.impl._ManagedBuffer.FreeCell(free.pos + d,free.count - d,free.next);
					free.count = d;
					free = free.next;
					break;
				}
			}
			free = free.next;
		}
		if(free == null) return -1;
		var pos = free.pos;
		free.pos += nvert;
		free.count -= nvert;
		return pos;
	}
	,allocBuffer: function(b) {
		var align;
		if((b.flags & 1 << h3d.BufferFlag.Quads[1]) != 0) align = 4; else if((b.flags & 1 << h3d.BufferFlag.Triangles[1]) != 0) align = 3; else align = 1;
		var p = this.allocPosition(b.vertices,align);
		if(p < 0) return false;
		b.position = p;
		b.buffer = this;
		return true;
	}
	,freeBuffer: function(b) {
		var prev = null;
		var f = this.freeList;
		var nvert = b.vertices;
		var end = b.position + nvert;
		while(f != null) {
			if(f.pos == end) {
				f.pos -= nvert;
				f.count += nvert;
				if(prev != null && prev.pos + prev.count == f.pos) {
					prev.count += f.count;
					prev.next = f.next;
				}
				nvert = 0;
				break;
			}
			if(f.pos > end) {
				if(prev != null && prev.pos + prev.count == b.position) prev.count += nvert; else {
					var n = new h3d.impl._ManagedBuffer.FreeCell(b.position,nvert,f);
					if(prev == null) this.freeList = n; else prev.next = n;
				}
				nvert = 0;
				break;
			}
			prev = f;
			f = f.next;
		}
		if(nvert != 0) throw "assert";
		if(this.freeList.count == this.size && !((this.flags & 1 << h3d.BufferFlag.Managed[1]) != 0)) this.dispose();
	}
	,dispose: function() {
		this.mem.freeManaged(this);
	}
	,__class__: h3d.impl.ManagedBuffer
};
h3d.impl.MemoryManager = function(driver) {
	this.bufferCount = 0;
	this.texMemory = 0;
	this.usedMemory = 0;
	this.driver = driver;
};
$hxClasses["h3d.impl.MemoryManager"] = h3d.impl.MemoryManager;
h3d.impl.MemoryManager.__name__ = true;
h3d.impl.MemoryManager.prototype = {
	init: function() {
		this.indexes = new Array();
		this.textures = new Array();
		this.buffers = new Array();
		this.initIndexes();
	}
	,initIndexes: function() {
		var indices;
		var this1;
		this1 = new Array(0);
		indices = this1;
		var _g = 0;
		while(_g < 65533) {
			var i = _g++;
			indices.push(i);
		}
		this.triIndexes = h3d.Indexes.alloc(indices);
		var indices1;
		var this2;
		this2 = new Array(0);
		indices1 = this2;
		var p = 0;
		var _g1 = 0;
		var _g2 = 16383;
		while(_g1 < _g2) {
			var i1 = _g1++;
			var k = i1 << 2;
			indices1.push(k);
			indices1.push(k + 1);
			indices1.push(k + 2);
			indices1.push(k + 2);
			indices1.push(k + 1);
			indices1.push(k + 3);
		}
		indices1.push(65533);
		this.quadIndexes = h3d.Indexes.alloc(indices1);
	}
	,garbage: function() {
	}
	,cleanManagedBuffers: function() {
		var _g1 = 0;
		var _g = this.buffers.length;
		while(_g1 < _g) {
			var i = _g1++;
			var b = this.buffers[i];
			var prev = null;
			while(b != null) {
				if(b.freeList.count == b.size) {
					b.dispose();
					if(prev == null) this.buffers[i] = b.next; else prev.next = b.next;
				} else prev = b;
				b = b.next;
			}
		}
	}
	,allocManaged: function(m) {
		if(m.vbuf != null) return;
		var mem = m.size * m.stride * 4;
		while(this.usedMemory + mem > 262144000 || this.bufferCount >= 4096 || (m.vbuf = this.driver.allocVertex(m)) == null) {
			var size = this.usedMemory - this.freeMemorySize();
			this.garbage();
			this.cleanManagedBuffers();
			if(this.usedMemory - this.freeMemorySize() == size) {
				if(this.bufferCount >= 4096) throw "Too many buffer";
				throw "Memory full";
			}
		}
		this.usedMemory += mem;
		this.bufferCount++;
	}
	,freeManaged: function(m) {
		if(m.vbuf == null) return;
		this.driver.disposeVertex(m.vbuf);
		m.vbuf = null;
		this.usedMemory -= m.size * m.stride * 4;
		this.bufferCount--;
	}
	,allocBuffer: function(b,stride) {
		var max;
		if((b.flags & 1 << h3d.BufferFlag.Quads[1]) != 0) max = 65532; else if((b.flags & 1 << h3d.BufferFlag.Triangles[1]) != 0) max = 65533; else max = 65534;
		if(b.vertices > max) {
			if(max == 65534) throw "Cannot split buffer with " + b.vertices + " vertices if it's not Quads/Triangles";
			var rem = b.vertices - max;
			b.vertices = max;
			this.allocBuffer(b,stride);
			var n = b;
			while(n.next != null) n = n.next;
			var flags = [];
			var _g = 0;
			var _g1 = h3d.impl.MemoryManager.ALL_FLAGS;
			while(_g < _g1.length) {
				var f = _g1[_g];
				++_g;
				if((b.flags & 1 << f[1]) != 0) flags.push(f);
			}
			n.next = new h3d.Buffer(rem,stride,flags);
			return;
		}
		if(!((b.flags & 1 << h3d.BufferFlag.Managed[1]) != 0)) {
			var m = new h3d.impl.ManagedBuffer(stride,b.vertices);
			if(!m.allocBuffer(b)) throw "assert";
			return;
		}
		var m1 = this.buffers[stride];
		var prev = null;
		while(m1 != null) {
			if(m1.allocBuffer(b)) return;
			prev = m1;
			m1 = m1.next;
		}
		var align;
		if((b.flags & 1 << h3d.BufferFlag.Triangles[1]) != 0) align = 3; else if((b.flags & 1 << h3d.BufferFlag.Quads[1]) != 0) align = 4; else align = 0;
		if(m1 == null && align > 0) {
			var total = b.vertices;
			var size = total;
			while(size > 2048) {
				m1 = this.buffers[stride];
				size >>= 1;
				size -= size % align;
				b.vertices = size;
				while(m1 != null) {
					if(m1.allocBuffer(b)) {
						var flags1 = [];
						var _g2 = 0;
						var _g11 = h3d.impl.MemoryManager.ALL_FLAGS;
						while(_g2 < _g11.length) {
							var f1 = _g11[_g2];
							++_g2;
							if((b.flags & 1 << f1[1]) != 0) flags1.push(f1);
						}
						b.next = new h3d.Buffer(total - size,stride,flags1);
						return;
					}
					m1 = m1.next;
				}
			}
			b.vertices = total;
		}
		m1 = new h3d.impl.ManagedBuffer(stride,65533,[h3d.BufferFlag.Managed]);
		if(prev == null) this.buffers[stride] = m1; else prev.next = m1;
		if(!m1.allocBuffer(b)) throw "assert";
	}
	,deleteIndexes: function(i) {
		HxOverrides.remove(this.indexes,i);
		this.driver.disposeIndexes(i.ibuf);
		i.ibuf = null;
		this.usedMemory -= i.count * 2;
	}
	,allocIndexes: function(i) {
		i.ibuf = this.driver.allocIndexes(i.count);
		this.indexes.push(i);
		this.usedMemory += i.count * 2;
	}
	,bpp: function(t) {
		return 4;
	}
	,cleanTextures: function(force) {
		if(force == null) force = true;
		this.textures.sort($bind(this,this.sortByLRU));
		var _g = 0;
		var _g1 = this.textures;
		while(_g < _g1.length) {
			var t = _g1[_g];
			++_g;
			if(t.realloc == null) continue;
			if(force || t.lastFrame < h3d.Engine.CURRENT.frameCount - 3600) {
				t.dispose();
				return true;
			}
		}
		return false;
	}
	,sortByLRU: function(t1,t2) {
		return t1.lastFrame - t2.lastFrame;
	}
	,deleteTexture: function(t) {
		HxOverrides.remove(this.textures,t);
		this.driver.disposeTexture(t.t);
		t.t = null;
		this.texMemory -= t.width * t.height * this.bpp(t);
	}
	,allocTexture: function(t) {
		var free = this.cleanTextures(false);
		t.t = this.driver.allocTexture(t);
		if(t.t == null) {
			if(!this.cleanTextures(true)) throw "Maximum texture memory reached";
			this.allocTexture(t);
			return;
		}
		this.textures.push(t);
		this.texMemory += t.width * t.height * this.bpp(t);
	}
	,onContextLost: function() {
		this.dispose();
		this.initIndexes();
	}
	,dispose: function() {
		this.triIndexes.dispose();
		this.quadIndexes.dispose();
		this.triIndexes = null;
		this.quadIndexes = null;
		var _g = 0;
		var _g1 = this.textures.slice();
		while(_g < _g1.length) {
			var t = _g1[_g];
			++_g;
			t.dispose();
		}
		var _g2 = 0;
		var _g11 = this.buffers.slice();
		while(_g2 < _g11.length) {
			var b = _g11[_g2];
			++_g2;
			var b1 = b;
			while(b1 != null) {
				b1.dispose();
				b1 = b1.next;
			}
		}
		var _g3 = 0;
		var _g12 = this.indexes.slice();
		while(_g3 < _g12.length) {
			var i = _g12[_g3];
			++_g3;
			i.dispose();
		}
		this.buffers = [];
		this.indexes = [];
		this.textures = [];
		this.bufferCount = 0;
		this.usedMemory = 0;
		this.texMemory = 0;
	}
	,freeMemorySize: function() {
		var size = 0;
		var _g = 0;
		var _g1 = this.buffers;
		while(_g < _g1.length) {
			var b = _g1[_g];
			++_g;
			var b1 = b;
			while(b1 != null) {
				var free = b1.freeList;
				while(free != null) {
					size += free.count * b1.stride * 4;
					free = free.next;
				}
				b1 = b1.next;
			}
		}
		return size;
	}
	,__class__: h3d.impl.MemoryManager
};
h3d.mat = {};
h3d.mat.Face = $hxClasses["h3d.mat.Face"] = { __ename__ : true, __constructs__ : ["None","Back","Front","Both"] };
h3d.mat.Face.None = ["None",0];
h3d.mat.Face.None.toString = $estr;
h3d.mat.Face.None.__enum__ = h3d.mat.Face;
h3d.mat.Face.Back = ["Back",1];
h3d.mat.Face.Back.toString = $estr;
h3d.mat.Face.Back.__enum__ = h3d.mat.Face;
h3d.mat.Face.Front = ["Front",2];
h3d.mat.Face.Front.toString = $estr;
h3d.mat.Face.Front.__enum__ = h3d.mat.Face;
h3d.mat.Face.Both = ["Both",3];
h3d.mat.Face.Both.toString = $estr;
h3d.mat.Face.Both.__enum__ = h3d.mat.Face;
h3d.mat.Face.__empty_constructs__ = [h3d.mat.Face.None,h3d.mat.Face.Back,h3d.mat.Face.Front,h3d.mat.Face.Both];
h3d.mat.Blend = $hxClasses["h3d.mat.Blend"] = { __ename__ : true, __constructs__ : ["One","Zero","SrcAlpha","SrcColor","DstAlpha","DstColor","OneMinusSrcAlpha","OneMinusSrcColor","OneMinusDstAlpha","OneMinusDstColor","ConstantColor","ConstantAlpha","OneMinusConstantColor","OneMinusConstantAlpha","SrcAlphaSaturate"] };
h3d.mat.Blend.One = ["One",0];
h3d.mat.Blend.One.toString = $estr;
h3d.mat.Blend.One.__enum__ = h3d.mat.Blend;
h3d.mat.Blend.Zero = ["Zero",1];
h3d.mat.Blend.Zero.toString = $estr;
h3d.mat.Blend.Zero.__enum__ = h3d.mat.Blend;
h3d.mat.Blend.SrcAlpha = ["SrcAlpha",2];
h3d.mat.Blend.SrcAlpha.toString = $estr;
h3d.mat.Blend.SrcAlpha.__enum__ = h3d.mat.Blend;
h3d.mat.Blend.SrcColor = ["SrcColor",3];
h3d.mat.Blend.SrcColor.toString = $estr;
h3d.mat.Blend.SrcColor.__enum__ = h3d.mat.Blend;
h3d.mat.Blend.DstAlpha = ["DstAlpha",4];
h3d.mat.Blend.DstAlpha.toString = $estr;
h3d.mat.Blend.DstAlpha.__enum__ = h3d.mat.Blend;
h3d.mat.Blend.DstColor = ["DstColor",5];
h3d.mat.Blend.DstColor.toString = $estr;
h3d.mat.Blend.DstColor.__enum__ = h3d.mat.Blend;
h3d.mat.Blend.OneMinusSrcAlpha = ["OneMinusSrcAlpha",6];
h3d.mat.Blend.OneMinusSrcAlpha.toString = $estr;
h3d.mat.Blend.OneMinusSrcAlpha.__enum__ = h3d.mat.Blend;
h3d.mat.Blend.OneMinusSrcColor = ["OneMinusSrcColor",7];
h3d.mat.Blend.OneMinusSrcColor.toString = $estr;
h3d.mat.Blend.OneMinusSrcColor.__enum__ = h3d.mat.Blend;
h3d.mat.Blend.OneMinusDstAlpha = ["OneMinusDstAlpha",8];
h3d.mat.Blend.OneMinusDstAlpha.toString = $estr;
h3d.mat.Blend.OneMinusDstAlpha.__enum__ = h3d.mat.Blend;
h3d.mat.Blend.OneMinusDstColor = ["OneMinusDstColor",9];
h3d.mat.Blend.OneMinusDstColor.toString = $estr;
h3d.mat.Blend.OneMinusDstColor.__enum__ = h3d.mat.Blend;
h3d.mat.Blend.ConstantColor = ["ConstantColor",10];
h3d.mat.Blend.ConstantColor.toString = $estr;
h3d.mat.Blend.ConstantColor.__enum__ = h3d.mat.Blend;
h3d.mat.Blend.ConstantAlpha = ["ConstantAlpha",11];
h3d.mat.Blend.ConstantAlpha.toString = $estr;
h3d.mat.Blend.ConstantAlpha.__enum__ = h3d.mat.Blend;
h3d.mat.Blend.OneMinusConstantColor = ["OneMinusConstantColor",12];
h3d.mat.Blend.OneMinusConstantColor.toString = $estr;
h3d.mat.Blend.OneMinusConstantColor.__enum__ = h3d.mat.Blend;
h3d.mat.Blend.OneMinusConstantAlpha = ["OneMinusConstantAlpha",13];
h3d.mat.Blend.OneMinusConstantAlpha.toString = $estr;
h3d.mat.Blend.OneMinusConstantAlpha.__enum__ = h3d.mat.Blend;
h3d.mat.Blend.SrcAlphaSaturate = ["SrcAlphaSaturate",14];
h3d.mat.Blend.SrcAlphaSaturate.toString = $estr;
h3d.mat.Blend.SrcAlphaSaturate.__enum__ = h3d.mat.Blend;
h3d.mat.Blend.__empty_constructs__ = [h3d.mat.Blend.One,h3d.mat.Blend.Zero,h3d.mat.Blend.SrcAlpha,h3d.mat.Blend.SrcColor,h3d.mat.Blend.DstAlpha,h3d.mat.Blend.DstColor,h3d.mat.Blend.OneMinusSrcAlpha,h3d.mat.Blend.OneMinusSrcColor,h3d.mat.Blend.OneMinusDstAlpha,h3d.mat.Blend.OneMinusDstColor,h3d.mat.Blend.ConstantColor,h3d.mat.Blend.ConstantAlpha,h3d.mat.Blend.OneMinusConstantColor,h3d.mat.Blend.OneMinusConstantAlpha,h3d.mat.Blend.SrcAlphaSaturate];
h3d.mat.Compare = $hxClasses["h3d.mat.Compare"] = { __ename__ : true, __constructs__ : ["Always","Never","Equal","NotEqual","Greater","GreaterEqual","Less","LessEqual"] };
h3d.mat.Compare.Always = ["Always",0];
h3d.mat.Compare.Always.toString = $estr;
h3d.mat.Compare.Always.__enum__ = h3d.mat.Compare;
h3d.mat.Compare.Never = ["Never",1];
h3d.mat.Compare.Never.toString = $estr;
h3d.mat.Compare.Never.__enum__ = h3d.mat.Compare;
h3d.mat.Compare.Equal = ["Equal",2];
h3d.mat.Compare.Equal.toString = $estr;
h3d.mat.Compare.Equal.__enum__ = h3d.mat.Compare;
h3d.mat.Compare.NotEqual = ["NotEqual",3];
h3d.mat.Compare.NotEqual.toString = $estr;
h3d.mat.Compare.NotEqual.__enum__ = h3d.mat.Compare;
h3d.mat.Compare.Greater = ["Greater",4];
h3d.mat.Compare.Greater.toString = $estr;
h3d.mat.Compare.Greater.__enum__ = h3d.mat.Compare;
h3d.mat.Compare.GreaterEqual = ["GreaterEqual",5];
h3d.mat.Compare.GreaterEqual.toString = $estr;
h3d.mat.Compare.GreaterEqual.__enum__ = h3d.mat.Compare;
h3d.mat.Compare.Less = ["Less",6];
h3d.mat.Compare.Less.toString = $estr;
h3d.mat.Compare.Less.__enum__ = h3d.mat.Compare;
h3d.mat.Compare.LessEqual = ["LessEqual",7];
h3d.mat.Compare.LessEqual.toString = $estr;
h3d.mat.Compare.LessEqual.__enum__ = h3d.mat.Compare;
h3d.mat.Compare.__empty_constructs__ = [h3d.mat.Compare.Always,h3d.mat.Compare.Never,h3d.mat.Compare.Equal,h3d.mat.Compare.NotEqual,h3d.mat.Compare.Greater,h3d.mat.Compare.GreaterEqual,h3d.mat.Compare.Less,h3d.mat.Compare.LessEqual];
h3d.mat.MipMap = $hxClasses["h3d.mat.MipMap"] = { __ename__ : true, __constructs__ : ["None","Nearest","Linear"] };
h3d.mat.MipMap.None = ["None",0];
h3d.mat.MipMap.None.toString = $estr;
h3d.mat.MipMap.None.__enum__ = h3d.mat.MipMap;
h3d.mat.MipMap.Nearest = ["Nearest",1];
h3d.mat.MipMap.Nearest.toString = $estr;
h3d.mat.MipMap.Nearest.__enum__ = h3d.mat.MipMap;
h3d.mat.MipMap.Linear = ["Linear",2];
h3d.mat.MipMap.Linear.toString = $estr;
h3d.mat.MipMap.Linear.__enum__ = h3d.mat.MipMap;
h3d.mat.MipMap.__empty_constructs__ = [h3d.mat.MipMap.None,h3d.mat.MipMap.Nearest,h3d.mat.MipMap.Linear];
h3d.mat.Filter = $hxClasses["h3d.mat.Filter"] = { __ename__ : true, __constructs__ : ["Nearest","Linear"] };
h3d.mat.Filter.Nearest = ["Nearest",0];
h3d.mat.Filter.Nearest.toString = $estr;
h3d.mat.Filter.Nearest.__enum__ = h3d.mat.Filter;
h3d.mat.Filter.Linear = ["Linear",1];
h3d.mat.Filter.Linear.toString = $estr;
h3d.mat.Filter.Linear.__enum__ = h3d.mat.Filter;
h3d.mat.Filter.__empty_constructs__ = [h3d.mat.Filter.Nearest,h3d.mat.Filter.Linear];
h3d.mat.Wrap = $hxClasses["h3d.mat.Wrap"] = { __ename__ : true, __constructs__ : ["Clamp","Repeat"] };
h3d.mat.Wrap.Clamp = ["Clamp",0];
h3d.mat.Wrap.Clamp.toString = $estr;
h3d.mat.Wrap.Clamp.__enum__ = h3d.mat.Wrap;
h3d.mat.Wrap.Repeat = ["Repeat",1];
h3d.mat.Wrap.Repeat.toString = $estr;
h3d.mat.Wrap.Repeat.__enum__ = h3d.mat.Wrap;
h3d.mat.Wrap.__empty_constructs__ = [h3d.mat.Wrap.Clamp,h3d.mat.Wrap.Repeat];
h3d.mat.Operation = $hxClasses["h3d.mat.Operation"] = { __ename__ : true, __constructs__ : ["Add","Sub","ReverseSub"] };
h3d.mat.Operation.Add = ["Add",0];
h3d.mat.Operation.Add.toString = $estr;
h3d.mat.Operation.Add.__enum__ = h3d.mat.Operation;
h3d.mat.Operation.Sub = ["Sub",1];
h3d.mat.Operation.Sub.toString = $estr;
h3d.mat.Operation.Sub.__enum__ = h3d.mat.Operation;
h3d.mat.Operation.ReverseSub = ["ReverseSub",2];
h3d.mat.Operation.ReverseSub.toString = $estr;
h3d.mat.Operation.ReverseSub.__enum__ = h3d.mat.Operation;
h3d.mat.Operation.__empty_constructs__ = [h3d.mat.Operation.Add,h3d.mat.Operation.Sub,h3d.mat.Operation.ReverseSub];
h3d.mat.TextureFlags = $hxClasses["h3d.mat.TextureFlags"] = { __ename__ : true, __constructs__ : ["Target","TargetDepth","TargetUseDefaultDepth","Cubic","TargetNoFlipY","MipMapped","IsNPOT","NoAlloc","Dynamic","FmtFloat","Fmt5_6_5","Fmt4_4_4_4","Fmt5_5_5_1","AlphaPremultiplied"] };
h3d.mat.TextureFlags.Target = ["Target",0];
h3d.mat.TextureFlags.Target.toString = $estr;
h3d.mat.TextureFlags.Target.__enum__ = h3d.mat.TextureFlags;
h3d.mat.TextureFlags.TargetDepth = ["TargetDepth",1];
h3d.mat.TextureFlags.TargetDepth.toString = $estr;
h3d.mat.TextureFlags.TargetDepth.__enum__ = h3d.mat.TextureFlags;
h3d.mat.TextureFlags.TargetUseDefaultDepth = ["TargetUseDefaultDepth",2];
h3d.mat.TextureFlags.TargetUseDefaultDepth.toString = $estr;
h3d.mat.TextureFlags.TargetUseDefaultDepth.__enum__ = h3d.mat.TextureFlags;
h3d.mat.TextureFlags.Cubic = ["Cubic",3];
h3d.mat.TextureFlags.Cubic.toString = $estr;
h3d.mat.TextureFlags.Cubic.__enum__ = h3d.mat.TextureFlags;
h3d.mat.TextureFlags.TargetNoFlipY = ["TargetNoFlipY",4];
h3d.mat.TextureFlags.TargetNoFlipY.toString = $estr;
h3d.mat.TextureFlags.TargetNoFlipY.__enum__ = h3d.mat.TextureFlags;
h3d.mat.TextureFlags.MipMapped = ["MipMapped",5];
h3d.mat.TextureFlags.MipMapped.toString = $estr;
h3d.mat.TextureFlags.MipMapped.__enum__ = h3d.mat.TextureFlags;
h3d.mat.TextureFlags.IsNPOT = ["IsNPOT",6];
h3d.mat.TextureFlags.IsNPOT.toString = $estr;
h3d.mat.TextureFlags.IsNPOT.__enum__ = h3d.mat.TextureFlags;
h3d.mat.TextureFlags.NoAlloc = ["NoAlloc",7];
h3d.mat.TextureFlags.NoAlloc.toString = $estr;
h3d.mat.TextureFlags.NoAlloc.__enum__ = h3d.mat.TextureFlags;
h3d.mat.TextureFlags.Dynamic = ["Dynamic",8];
h3d.mat.TextureFlags.Dynamic.toString = $estr;
h3d.mat.TextureFlags.Dynamic.__enum__ = h3d.mat.TextureFlags;
h3d.mat.TextureFlags.FmtFloat = ["FmtFloat",9];
h3d.mat.TextureFlags.FmtFloat.toString = $estr;
h3d.mat.TextureFlags.FmtFloat.__enum__ = h3d.mat.TextureFlags;
h3d.mat.TextureFlags.Fmt5_6_5 = ["Fmt5_6_5",10];
h3d.mat.TextureFlags.Fmt5_6_5.toString = $estr;
h3d.mat.TextureFlags.Fmt5_6_5.__enum__ = h3d.mat.TextureFlags;
h3d.mat.TextureFlags.Fmt4_4_4_4 = ["Fmt4_4_4_4",11];
h3d.mat.TextureFlags.Fmt4_4_4_4.toString = $estr;
h3d.mat.TextureFlags.Fmt4_4_4_4.__enum__ = h3d.mat.TextureFlags;
h3d.mat.TextureFlags.Fmt5_5_5_1 = ["Fmt5_5_5_1",12];
h3d.mat.TextureFlags.Fmt5_5_5_1.toString = $estr;
h3d.mat.TextureFlags.Fmt5_5_5_1.__enum__ = h3d.mat.TextureFlags;
h3d.mat.TextureFlags.AlphaPremultiplied = ["AlphaPremultiplied",13];
h3d.mat.TextureFlags.AlphaPremultiplied.toString = $estr;
h3d.mat.TextureFlags.AlphaPremultiplied.__enum__ = h3d.mat.TextureFlags;
h3d.mat.TextureFlags.__empty_constructs__ = [h3d.mat.TextureFlags.Target,h3d.mat.TextureFlags.TargetDepth,h3d.mat.TextureFlags.TargetUseDefaultDepth,h3d.mat.TextureFlags.Cubic,h3d.mat.TextureFlags.TargetNoFlipY,h3d.mat.TextureFlags.MipMapped,h3d.mat.TextureFlags.IsNPOT,h3d.mat.TextureFlags.NoAlloc,h3d.mat.TextureFlags.Dynamic,h3d.mat.TextureFlags.FmtFloat,h3d.mat.TextureFlags.Fmt5_6_5,h3d.mat.TextureFlags.Fmt4_4_4_4,h3d.mat.TextureFlags.Fmt5_5_5_1,h3d.mat.TextureFlags.AlphaPremultiplied];
h3d.mat.Material = function(shader) {
	if(shader != null) this.addPass(new h3d.mat.Pass("default",null)).addShader(shader);
};
$hxClasses["h3d.mat.Material"] = h3d.mat.Material;
h3d.mat.Material.__name__ = true;
h3d.mat.Material.prototype = {
	addPass: function(p) {
		var prev = null;
		var cur = this.passes;
		while(cur != null) {
			prev = cur;
			cur = cur.nextPass;
		}
		if(prev == null) this.passes = p; else prev.nextPass = p;
		p.nextPass = null;
		return p;
	}
	,__class__: h3d.mat.Material
};
h3d.mat.MeshMaterial = function(texture) {
	this.mshader = new h3d.shader.BaseMesh();
	this.set_blendMode(0);
	h3d.mat.Material.call(this,this.mshader);
	this.set_texture(texture);
};
$hxClasses["h3d.mat.MeshMaterial"] = h3d.mat.MeshMaterial;
h3d.mat.MeshMaterial.__name__ = true;
h3d.mat.MeshMaterial.__super__ = h3d.mat.Material;
h3d.mat.MeshMaterial.prototype = $extend(h3d.mat.Material.prototype,{
	set_blendMode: function(v) {
		if(this.passes != null) switch(v) {
		case 0:
			this.passes.blend(h3d.mat.Blend.One,h3d.mat.Blend.Zero);
			this.passes.setPassName("default");
			break;
		case 1:
			this.passes.blend(h3d.mat.Blend.SrcAlpha,h3d.mat.Blend.OneMinusSrcAlpha);
			this.passes.setPassName("alpha");
			break;
		case 2:
			this.passes.blend(h3d.mat.Blend.SrcAlpha,h3d.mat.Blend.One);
			this.passes.setPassName("additive");
			break;
		case 3:
			this.passes.blend(h3d.mat.Blend.OneMinusDstColor,h3d.mat.Blend.One);
			this.passes.setPassName("additive");
			break;
		}
		return this.blendMode = v;
	}
	,set_texture: function(t) {
		if(t == null) {
			if(this.textureShader != null) {
				this.passes.removeShader(this.textureShader);
				this.textureShader = null;
			}
		} else {
			if(this.textureShader == null) {
				this.textureShader = new h3d.shader.Texture();
				this.passes.addShader(this.textureShader);
			}
			this.textureShader.texture__ = t;
		}
		return t;
	}
	,__class__: h3d.mat.MeshMaterial
	,__properties__: {set_texture:"set_texture",set_blendMode:"set_blendMode"}
});
h3d.mat.Pass = function(name,shaders,parent) {
	this.bits = 0;
	this.parentPass = parent;
	this.shaders = shaders;
	this.setPassName(name);
	this.set_culling(h3d.mat.Face.Back);
	this.blend(h3d.mat.Blend.One,h3d.mat.Blend.Zero);
	this.depth(true,h3d.mat.Compare.Less);
	this.set_blendOp(this.set_blendAlphaOp(h3d.mat.Operation.Add));
	this.set_colorMask(15);
};
$hxClasses["h3d.mat.Pass"] = h3d.mat.Pass;
h3d.mat.Pass.__name__ = true;
h3d.mat.Pass.prototype = {
	setPassName: function(name) {
		this.name = name;
		this.passId = hxsl.Globals.allocID(name);
	}
	,blend: function(src,dst) {
		this.set_blendSrc(src);
		this.set_blendAlphaSrc(src);
		this.set_blendDst(dst);
		this.set_blendAlphaDst(dst);
	}
	,depth: function(write,test) {
		this.set_depthWrite(write);
		this.set_depthTest(test);
	}
	,addShader: function(s) {
		this.shaders = new hxsl.ShaderList(s,this.shaders);
		return s;
	}
	,removeShader: function(s) {
		var sl = this.shaders;
		var prev = null;
		while(sl != null) {
			if(sl.s == s) {
				if(prev == null) this.shaders = sl.next; else prev.next = sl.next;
				return true;
			}
			prev = sl;
			sl = sl.next;
		}
		return false;
	}
	,getShadersRec: function() {
		if(this.parentPass == null || this.parentShaders == this.parentPass.shaders) return this.shaders;
		var s = this.shaders;
		var prev = null;
		while(s != null && s != this.parentShaders) {
			prev = s;
			s = s.next;
		}
		this.parentShaders = this.parentPass.shaders;
		if(prev == null) this.shaders = this.parentShaders; else prev.next = this.parentShaders;
		return this.shaders;
	}
	,set_culling: function(v) {
		this.bits = this.bits & -4 | v[1];
		return this.culling = v;
	}
	,set_depthWrite: function(v) {
		this.bits = this.bits & -5 | (v?1:0) << 2;
		return this.depthWrite = v;
	}
	,set_depthTest: function(v) {
		this.bits = this.bits & -57 | v[1] << 3;
		return this.depthTest = v;
	}
	,set_blendSrc: function(v) {
		this.bits = this.bits & -961 | v[1] << 6;
		return this.blendSrc = v;
	}
	,set_blendDst: function(v) {
		this.bits = this.bits & -15361 | v[1] << 10;
		return this.blendDst = v;
	}
	,set_blendAlphaSrc: function(v) {
		this.bits = this.bits & -245761 | v[1] << 14;
		return this.blendAlphaSrc = v;
	}
	,set_blendAlphaDst: function(v) {
		this.bits = this.bits & -3932161 | v[1] << 18;
		return this.blendAlphaDst = v;
	}
	,set_blendOp: function(v) {
		this.bits = this.bits & -12582913 | v[1] << 22;
		return this.blendOp = v;
	}
	,set_blendAlphaOp: function(v) {
		this.bits = this.bits & -50331649 | v[1] << 24;
		return this.blendAlphaOp = v;
	}
	,set_colorMask: function(v) {
		this.bits = this.bits & -1006632961 | (v & 15) << 26;
		return this.colorMask = v;
	}
	,__class__: h3d.mat.Pass
	,__properties__: {set_colorMask:"set_colorMask",set_blendAlphaOp:"set_blendAlphaOp",set_blendOp:"set_blendOp",set_blendAlphaDst:"set_blendAlphaDst",set_blendAlphaSrc:"set_blendAlphaSrc",set_blendDst:"set_blendDst",set_blendSrc:"set_blendSrc",set_depthTest:"set_depthTest",set_depthWrite:"set_depthWrite",set_culling:"set_culling"}
};
h3d.mat.Texture = function(w,h,flags,allocPos) {
	var engine = h3d.Engine.CURRENT;
	this.mem = engine.mem;
	this.id = ++h3d.mat.Texture.UID;
	this.flags = 0;
	if(flags != null) {
		var _g = 0;
		while(_g < flags.length) {
			var f = flags[_g];
			++_g;
			this.flags |= 1 << f[1];
		}
	}
	var tw = 1;
	var th = 1;
	while(tw < w) tw <<= 1;
	while(th < h) th <<= 1;
	if(tw != w || th != h) this.flags |= 1 << h3d.mat.TextureFlags.IsNPOT[1];
	if((this.flags & 1 << h3d.mat.TextureFlags.Target[1]) != 0) this.realloc = function() {
	};
	this.width = w;
	this.height = h;
	this.set_mipMap((this.flags & 1 << h3d.mat.TextureFlags.MipMapped[1]) != 0?h3d.mat.MipMap.Nearest:h3d.mat.MipMap.None);
	this.set_filter(h3d.mat.Filter.Linear);
	this.set_wrap(h3d.mat.Wrap.Clamp);
	this.bits &= 32767;
	this.alloc();
};
$hxClasses["h3d.mat.Texture"] = h3d.mat.Texture;
h3d.mat.Texture.__name__ = true;
h3d.mat.Texture.fromColor = function(color,allocPos) {
	var t = h3d.mat.Texture.COLOR_CACHE.get(color);
	if(t != null) return t;
	var t1 = new h3d.mat.Texture(1,1,null,allocPos);
	t1.clear(color);
	t1.realloc = function() {
		t1.clear(color);
	};
	h3d.mat.Texture.COLOR_CACHE.set(color,t1);
	return t1;
};
h3d.mat.Texture.prototype = {
	alloc: function() {
		if(this.t == null) this.mem.allocTexture(this);
	}
	,setName: function(n) {
		this.name = n;
	}
	,set_mipMap: function(m) {
		this.bits |= 524288;
		this.bits = this.bits & -4 | m[1];
		return this.mipMap = m;
	}
	,set_filter: function(f) {
		this.bits |= 524288;
		this.bits = this.bits & -25 | f[1] << 3;
		return this.filter = f;
	}
	,set_wrap: function(w) {
		this.bits |= 524288;
		this.bits = this.bits & -193 | w[1] << 6;
		return this.wrap = w;
	}
	,resize: function(width,height) {
		this.dispose();
		var tw = 1;
		var th = 1;
		while(tw < width) tw <<= 1;
		while(th < height) th <<= 1;
		if(tw != width || th != height) this.flags |= 1 << h3d.mat.TextureFlags.IsNPOT[1]; else this.flags &= 268435455 - (1 << h3d.mat.TextureFlags.IsNPOT[1]);
		this.width = width;
		this.height = height;
		if(!((this.flags & 1 << h3d.mat.TextureFlags.NoAlloc[1]) != 0)) this.alloc();
	}
	,clear: function(color) {
		this.alloc();
		var p = hxd.Pixels.alloc(this.width,this.height,hxd.PixelFormat.BGRA);
		var k = 0;
		var b = color & 255;
		var g = color >> 8 & 255;
		var r = color >> 16 & 255;
		var a = color >>> 24;
		var _g1 = 0;
		var _g = this.width * this.height;
		while(_g1 < _g) {
			var i = _g1++;
			p.bytes.set(k++,b);
			p.bytes.set(k++,g);
			p.bytes.set(k++,r);
			p.bytes.set(k++,a);
		}
		this.uploadPixels(p);
		p.dispose();
	}
	,uploadBitmap: function(bmp,mipLevel,side) {
		if(side == null) side = 0;
		if(mipLevel == null) mipLevel = 0;
		this.alloc();
		this.mem.driver.uploadTextureBitmap(this,bmp,mipLevel,side);
	}
	,uploadPixels: function(pixels,mipLevel,side) {
		if(side == null) side = 0;
		if(mipLevel == null) mipLevel = 0;
		this.alloc();
		this.mem.driver.uploadTexturePixels(this,pixels,mipLevel,side);
	}
	,dispose: function() {
		if(this.t != null) this.mem.deleteTexture(this);
	}
	,__class__: h3d.mat.Texture
	,__properties__: {set_wrap:"set_wrap",set_filter:"set_filter",set_mipMap:"set_mipMap"}
};
hxd.res = {};
hxd.res.Resource = function(entry) {
	this.entry = entry;
};
$hxClasses["hxd.res.Resource"] = hxd.res.Resource;
hxd.res.Resource.__name__ = true;
hxd.res.Resource.prototype = {
	toString: function() {
		return this.entry.get_path();
	}
	,watch: function(onChanged) {
		if(hxd.res.Resource.LIVE_UPDATE) this.entry.watch(onChanged);
	}
	,__class__: hxd.res.Resource
};
hxd.res.Any = function(loader,entry) {
	hxd.res.Resource.call(this,entry);
	this.loader = loader;
};
$hxClasses["hxd.res.Any"] = hxd.res.Any;
hxd.res.Any.__name__ = true;
hxd.res.Any.__super__ = hxd.res.Resource;
hxd.res.Any.prototype = $extend(hxd.res.Resource.prototype,{
	toFbx: function() {
		return this.loader.loadFbxModel(this.entry.get_path()).toFbx(this.loader);
	}
	,__class__: hxd.res.Any
});
hxd.res.FileSystem = function() { };
$hxClasses["hxd.res.FileSystem"] = hxd.res.FileSystem;
hxd.res.FileSystem.__name__ = true;
hxd.res.FileSystem.prototype = {
	__class__: hxd.res.FileSystem
};
hxd.res.Loader = function(fs) {
	this.fs = fs;
	this.cache = new haxe.ds.StringMap();
};
$hxClasses["hxd.res.Loader"] = hxd.res.Loader;
hxd.res.Loader.__name__ = true;
hxd.res.Loader.prototype = {
	load: function(path) {
		return new hxd.res.Any(this,this.fs.get(path));
	}
	,loadFbxModel: function(path) {
		var m = this.cache.get(path);
		if(m == null) {
			m = new hxd.res.FbxModel(this.fs.get(path));
			this.cache.set(path,m);
		}
		return m;
	}
	,loadImage: function(path) {
		var i = this.cache.get(path);
		if(i == null) {
			i = new hxd.res.Image(this.fs.get(path));
			this.cache.set(path,i);
		}
		return i;
	}
	,__class__: hxd.res.Loader
};
var haxe = {};
haxe.Unserializer = function(buf) {
	this.buf = buf;
	this.length = buf.length;
	this.pos = 0;
	this.scache = new Array();
	this.cache = new Array();
	var r = haxe.Unserializer.DEFAULT_RESOLVER;
	if(r == null) {
		r = Type;
		haxe.Unserializer.DEFAULT_RESOLVER = r;
	}
	this.setResolver(r);
};
$hxClasses["haxe.Unserializer"] = haxe.Unserializer;
haxe.Unserializer.__name__ = true;
haxe.Unserializer.initCodes = function() {
	var codes = new Array();
	var _g1 = 0;
	var _g = haxe.Unserializer.BASE64.length;
	while(_g1 < _g) {
		var i = _g1++;
		codes[haxe.Unserializer.BASE64.charCodeAt(i)] = i;
	}
	return codes;
};
haxe.Unserializer.run = function(v) {
	return new haxe.Unserializer(v).unserialize();
};
haxe.Unserializer.prototype = {
	setResolver: function(r) {
		if(r == null) this.resolver = { resolveClass : function(_) {
			return null;
		}, resolveEnum : function(_1) {
			return null;
		}}; else this.resolver = r;
	}
	,get: function(p) {
		return this.buf.charCodeAt(p);
	}
	,readDigits: function() {
		var k = 0;
		var s = false;
		var fpos = this.pos;
		while(true) {
			var c = this.buf.charCodeAt(this.pos);
			if(c != c) break;
			if(c == 45) {
				if(this.pos != fpos) break;
				s = true;
				this.pos++;
				continue;
			}
			if(c < 48 || c > 57) break;
			k = k * 10 + (c - 48);
			this.pos++;
		}
		if(s) k *= -1;
		return k;
	}
	,unserializeObject: function(o) {
		while(true) {
			if(this.pos >= this.length) throw "Invalid object";
			if(this.buf.charCodeAt(this.pos) == 103) break;
			var k = this.unserialize();
			if(!(typeof(k) == "string")) throw "Invalid object key";
			var v = this.unserialize();
			o[k] = v;
		}
		this.pos++;
	}
	,unserializeEnum: function(edecl,tag) {
		if(this.get(this.pos++) != 58) throw "Invalid enum format";
		var nargs = this.readDigits();
		if(nargs == 0) return Type.createEnum(edecl,tag);
		var args = new Array();
		while(nargs-- > 0) args.push(this.unserialize());
		return Type.createEnum(edecl,tag,args);
	}
	,unserialize: function() {
		var _g = this.get(this.pos++);
		switch(_g) {
		case 110:
			return null;
		case 116:
			return true;
		case 102:
			return false;
		case 122:
			return 0;
		case 105:
			return this.readDigits();
		case 100:
			var p1 = this.pos;
			while(true) {
				var c = this.buf.charCodeAt(this.pos);
				if(c >= 43 && c < 58 || c == 101 || c == 69) this.pos++; else break;
			}
			return Std.parseFloat(HxOverrides.substr(this.buf,p1,this.pos - p1));
		case 121:
			var len = this.readDigits();
			if(this.get(this.pos++) != 58 || this.length - this.pos < len) throw "Invalid string length";
			var s = HxOverrides.substr(this.buf,this.pos,len);
			this.pos += len;
			s = decodeURIComponent(s.split("+").join(" "));
			this.scache.push(s);
			return s;
		case 107:
			return Math.NaN;
		case 109:
			return Math.NEGATIVE_INFINITY;
		case 112:
			return Math.POSITIVE_INFINITY;
		case 97:
			var buf = this.buf;
			var a = new Array();
			this.cache.push(a);
			while(true) {
				var c1 = this.buf.charCodeAt(this.pos);
				if(c1 == 104) {
					this.pos++;
					break;
				}
				if(c1 == 117) {
					this.pos++;
					var n = this.readDigits();
					a[a.length + n - 1] = null;
				} else a.push(this.unserialize());
			}
			return a;
		case 111:
			var o = { };
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 114:
			var n1 = this.readDigits();
			if(n1 < 0 || n1 >= this.cache.length) throw "Invalid reference";
			return this.cache[n1];
		case 82:
			var n2 = this.readDigits();
			if(n2 < 0 || n2 >= this.scache.length) throw "Invalid string reference";
			return this.scache[n2];
		case 120:
			throw this.unserialize();
			break;
		case 99:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) throw "Class not found " + name;
			var o1 = Type.createEmptyInstance(cl);
			this.cache.push(o1);
			this.unserializeObject(o1);
			return o1;
		case 119:
			var name1 = this.unserialize();
			var edecl = this.resolver.resolveEnum(name1);
			if(edecl == null) throw "Enum not found " + name1;
			var e = this.unserializeEnum(edecl,this.unserialize());
			this.cache.push(e);
			return e;
		case 106:
			var name2 = this.unserialize();
			var edecl1 = this.resolver.resolveEnum(name2);
			if(edecl1 == null) throw "Enum not found " + name2;
			this.pos++;
			var index = this.readDigits();
			var tag = Type.getEnumConstructs(edecl1)[index];
			if(tag == null) throw "Unknown enum index " + name2 + "@" + index;
			var e1 = this.unserializeEnum(edecl1,tag);
			this.cache.push(e1);
			return e1;
		case 108:
			var l = new List();
			this.cache.push(l);
			var buf1 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) l.add(this.unserialize());
			this.pos++;
			return l;
		case 98:
			var h = new haxe.ds.StringMap();
			this.cache.push(h);
			var buf2 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s1 = this.unserialize();
				h.set(s1,this.unserialize());
			}
			this.pos++;
			return h;
		case 113:
			var h1 = new haxe.ds.IntMap();
			this.cache.push(h1);
			var buf3 = this.buf;
			var c2 = this.get(this.pos++);
			while(c2 == 58) {
				var i = this.readDigits();
				h1.set(i,this.unserialize());
				c2 = this.get(this.pos++);
			}
			if(c2 != 104) throw "Invalid IntMap format";
			return h1;
		case 77:
			var h2 = new haxe.ds.ObjectMap();
			this.cache.push(h2);
			var buf4 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s2 = this.unserialize();
				h2.set(s2,this.unserialize());
			}
			this.pos++;
			return h2;
		case 118:
			var d;
			var s3 = HxOverrides.substr(this.buf,this.pos,19);
			d = HxOverrides.strDate(s3);
			this.cache.push(d);
			this.pos += 19;
			return d;
		case 115:
			var len1 = this.readDigits();
			var buf5 = this.buf;
			if(this.get(this.pos++) != 58 || this.length - this.pos < len1) throw "Invalid bytes length";
			var codes = haxe.Unserializer.CODES;
			if(codes == null) {
				codes = haxe.Unserializer.initCodes();
				haxe.Unserializer.CODES = codes;
			}
			var i1 = this.pos;
			var rest = len1 & 3;
			var size;
			size = (len1 >> 2) * 3 + (rest >= 2?rest - 1:0);
			var max = i1 + (len1 - rest);
			var bytes = haxe.io.Bytes.alloc(size);
			var bpos = 0;
			while(i1 < max) {
				var c11 = codes[StringTools.fastCodeAt(buf5,i1++)];
				var c21 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c11 << 2 | c21 >> 4);
				var c3 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c21 << 4 | c3 >> 2);
				var c4 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c3 << 6 | c4);
			}
			if(rest >= 2) {
				var c12 = codes[StringTools.fastCodeAt(buf5,i1++)];
				var c22 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c12 << 2 | c22 >> 4);
				if(rest == 3) {
					var c31 = codes[StringTools.fastCodeAt(buf5,i1++)];
					bytes.set(bpos++,c22 << 4 | c31 >> 2);
				}
			}
			this.pos += len1;
			this.cache.push(bytes);
			return bytes;
		case 67:
			var name3 = this.unserialize();
			var cl1 = this.resolver.resolveClass(name3);
			if(cl1 == null) throw "Class not found " + name3;
			var o2 = Type.createEmptyInstance(cl1);
			this.cache.push(o2);
			o2.hxUnserialize(this);
			if(this.get(this.pos++) != 103) throw "Invalid custom data";
			return o2;
		default:
		}
		this.pos--;
		throw "Invalid char " + this.buf.charAt(this.pos) + " at position " + this.pos;
	}
	,__class__: haxe.Unserializer
};
h3d.pass = {};
h3d.pass.Base = function() {
	this.priority = 0;
	this.manager = new h3d.shader.Manager(this.getOutputs());
	this.initGlobals();
	this.lightSystem = new h3d.pass.LightSystem(this.manager.globals);
};
$hxClasses["h3d.pass.Base"] = h3d.pass.Base;
h3d.pass.Base.__name__ = true;
h3d.pass.Base.sortByShader = function(o1,o2) {
	var d = o1.shader.id - o2.shader.id;
	if(d != 0) return d;
	return 0;
};
h3d.pass.Base.prototype = {
	getOutputs: function() {
		return ["output.position","output.color"];
	}
	,allocBuffer: function(s,shaders) {
		var buf = new h3d.shader.Buffers(s);
		this.manager.fillGlobals(buf,s);
		this.manager.fillParams(buf,s,shaders);
		return buf;
	}
	,setupShaders: function(passes) {
		var p = passes;
		var lightInit = false;
		var instances = [];
		while(p != null) {
			var shaders = p.pass.getShadersRec();
			if(p.pass.enableLights && this.lightSystem != null) {
				if(!lightInit) this.lightSystem.initLights(this.ctx.lights);
				shaders = this.lightSystem.computeLight(p.obj,shaders);
			}
			var count = 0;
			var _g = new hxsl._ShaderList.ShaderIterator(shaders);
			while(_g.l != null) {
				var s = _g.next();
				p.shaders[count++] = s;
			}
			var _g1 = 0;
			var _g2 = count >> 1;
			while(_g1 < _g2) {
				var n = _g1++;
				var n2 = count - 1 - n;
				var tmp = p.shaders[n];
				p.shaders[n] = p.shaders[n2];
				p.shaders[n2] = tmp;
			}
			var _g3 = 0;
			while(_g3 < count) {
				var i = _g3++;
				var s1 = p.shaders[i];
				s1.updateConstants(this.manager.globals);
				instances[i] = s1.instance;
			}
			instances[count] = null;
			p.shader = this.manager.compileInstances(instances);
			p = p.next;
		}
	}
	,draw: function(ctx,passes) {
		this.ctx = ctx;
		var $it0 = ctx.sharedGlobals.keys();
		while( $it0.hasNext() ) {
			var k = $it0.next();
			this.manager.globals.fastSet(k,ctx.sharedGlobals.get(k));
		}
		this.setGlobals();
		this.setupShaders(passes);
		passes = haxe.ds.ListSort.sortSingleLinked(passes,h3d.pass.Base.sortByShader);
		var p = passes;
		while(p != null) {
			this.set_globalModelView(p.obj.absPos);
			this.set_globalModelViewInverse(p.obj.getInvPos());
			ctx.engine.selectShader(p.shader);
			var buf = this.allocBuffer(p.shader,p.shaders);
			ctx.engine.selectMaterial(p.pass);
			ctx.engine.uploadShaderBuffers(buf,0);
			ctx.engine.uploadShaderBuffers(buf,1);
			ctx.engine.uploadShaderBuffers(buf,2);
			ctx.drawPass = p;
			p.obj.draw(ctx);
			p = p.next;
		}
		ctx.drawPass = null;
		this.ctx = null;
		return passes;
	}
	,set_cameraView: function(v) {
		this.manager.globals.fastSet(this.cameraView_id,v);
		return v;
	}
	,set_cameraProj: function(v) {
		this.manager.globals.fastSet(this.cameraProj_id,v);
		return v;
	}
	,set_cameraPos: function(v) {
		this.manager.globals.fastSet(this.cameraPos_id,v);
		return v;
	}
	,set_cameraProjDiag: function(v) {
		this.manager.globals.fastSet(this.cameraProjDiag_id,v);
		return v;
	}
	,set_cameraViewProj: function(v) {
		this.manager.globals.fastSet(this.cameraViewProj_id,v);
		return v;
	}
	,set_cameraInverseViewProj: function(v) {
		this.manager.globals.fastSet(this.cameraInverseViewProj_id,v);
		return v;
	}
	,set_globalTime: function(v) {
		this.manager.globals.fastSet(this.globalTime_id,v);
		return v;
	}
	,set_globalModelView: function(v) {
		this.manager.globals.fastSet(this.globalModelView_id,v);
		return v;
	}
	,set_globalModelViewInverse: function(v) {
		this.manager.globals.fastSet(this.globalModelViewInverse_id,v);
		return v;
	}
	,set_globalFlipY: function(v) {
		this.manager.globals.fastSet(this.globalFlipY_id,v);
		return v;
	}
	,initGlobals: function() {
		var this1;
		this1 = hxsl.Globals.allocID("camera.view");
		this.cameraView_id = this1;
		var this2;
		this2 = hxsl.Globals.allocID("camera.proj");
		this.cameraProj_id = this2;
		var this3;
		this3 = hxsl.Globals.allocID("camera.position");
		this.cameraPos_id = this3;
		var this4;
		this4 = hxsl.Globals.allocID("camera.projDiag");
		this.cameraProjDiag_id = this4;
		var this5;
		this5 = hxsl.Globals.allocID("camera.viewProj");
		this.cameraViewProj_id = this5;
		var this6;
		this6 = hxsl.Globals.allocID("camera.inverseViewProj");
		this.cameraInverseViewProj_id = this6;
		var this7;
		this7 = hxsl.Globals.allocID("global.time");
		this.globalTime_id = this7;
		var this8;
		this8 = hxsl.Globals.allocID("global.modelView");
		this.globalModelView_id = this8;
		var this9;
		this9 = hxsl.Globals.allocID("global.modelViewInverse");
		this.globalModelViewInverse_id = this9;
		var this10;
		this10 = hxsl.Globals.allocID("global.flipY");
		this.globalFlipY_id = this10;
	}
	,setGlobals: function() {
		this.set_cameraView(this.ctx.camera.mcam);
		this.set_cameraProj(this.ctx.camera.mproj);
		this.set_cameraPos(this.ctx.camera.pos);
		this.set_cameraProjDiag(new h3d.Vector(this.ctx.camera.mproj._11,this.ctx.camera.mproj._22,this.ctx.camera.mproj._33,this.ctx.camera.mproj._44));
		this.set_cameraViewProj(this.ctx.camera.m);
		this.set_cameraInverseViewProj(this.ctx.camera.getInverseViewProj());
		this.set_globalTime(this.ctx.time);
		this.set_globalFlipY((function($this) {
			var $r;
			var t = $this.ctx.engine.getTarget();
			$r = t != null && !((t.flags & 1 << h3d.mat.TextureFlags.TargetNoFlipY[1]) != 0)?-1:1;
			return $r;
		}(this)));
	}
	,__class__: h3d.pass.Base
	,__properties__: {set_globalFlipY:"set_globalFlipY",set_globalModelViewInverse:"set_globalModelViewInverse",set_globalModelView:"set_globalModelView",set_globalTime:"set_globalTime",set_cameraInverseViewProj:"set_cameraInverseViewProj",set_cameraViewProj:"set_cameraViewProj",set_cameraProjDiag:"set_cameraProjDiag",set_cameraPos:"set_cameraPos",set_cameraProj:"set_cameraProj",set_cameraView:"set_cameraView"}
};
h3d.pass.ScreenFx = function(shader) {
	this.shader = shader;
	this.manager = new h3d.shader.Manager(["output.position","output.color"]);
	this.pass = new h3d.mat.Pass(Std.string(this),new hxsl.ShaderList(shader));
	this.pass.set_culling(h3d.mat.Face.None);
	this.pass.depth(false,h3d.mat.Compare.Always);
	this.plan = new h3d.prim.Plan2D();
	this.engine = h3d.Engine.CURRENT;
};
$hxClasses["h3d.pass.ScreenFx"] = h3d.pass.ScreenFx;
h3d.pass.ScreenFx.__name__ = true;
h3d.pass.ScreenFx.prototype = {
	render: function() {
		var shaders = [this.shader];
		var rts = this.manager.compileShaders(shaders);
		this.engine.selectMaterial(this.pass);
		this.engine.selectShader(rts);
		var buf = new h3d.shader.Buffers(rts);
		this.manager.fillGlobals(buf,rts);
		this.manager.fillParams(buf,rts,shaders);
		this.engine.uploadShaderBuffers(buf,0);
		this.engine.uploadShaderBuffers(buf,1);
		this.engine.uploadShaderBuffers(buf,2);
		this.plan.render(this.engine);
	}
	,__class__: h3d.pass.ScreenFx
};
h3d.pass.Blur = function(quality,sigma) {
	if(sigma == null) sigma = 1.;
	if(quality == null) quality = 1;
	h3d.pass.ScreenFx.call(this,new h3d.shader.Blur());
	this.set_quality(quality);
	this.set_sigma(sigma);
};
$hxClasses["h3d.pass.Blur"] = h3d.pass.Blur;
h3d.pass.Blur.__name__ = true;
h3d.pass.Blur.__super__ = h3d.pass.ScreenFx;
h3d.pass.Blur.prototype = $extend(h3d.pass.ScreenFx.prototype,{
	set_quality: function(q) {
		this.values = null;
		return this.quality = q;
	}
	,set_sigma: function(s) {
		this.values = null;
		return this.sigma = s;
	}
	,gauss: function(x,s) {
		if(s <= 0) if(x == 0) return 1; else return 0;
		var sq = s * s;
		var p = Math.pow(2.718281828459,-(x * x) / (2 * sq));
		return p / Math.sqrt(2 * Math.PI * sq);
	}
	,apply: function(src,tmp,isDepth) {
		if(isDepth == null) isDepth = false;
		if(this.quality == 0) return;
		var alloc = tmp == null;
		if(alloc) tmp = new h3d.mat.Texture(src.width,src.height,[h3d.mat.TextureFlags.Target,h3d.mat.TextureFlags.TargetNoFlipY]);
		if(this.values == null) {
			this.values = [];
			var tot = 0.;
			var _g1 = 0;
			var _g = this.quality + 1;
			while(_g1 < _g) {
				var i = _g1++;
				var g = this.gauss(i,this.sigma);
				this.values[i] = g;
				tot += g;
				if(i > 0) tot += g;
			}
			var _g11 = 0;
			var _g2 = this.quality + 1;
			while(_g11 < _g2) {
				var i1 = _g11++;
				this.values[i1] /= tot;
			}
		}
		this.shader.set_Quality(this.quality + 1);
		this.shader.texture__ = src;
		this.shader.values__ = this.values;
		this.shader.set_isDepth(isDepth);
		this.shader.pixel__.set(1 / src.width,0,null,null);
		this.engine.setTarget(tmp,-65536);
		this.render();
		this.engine.setTarget(null);
		this.shader.texture__ = tmp;
		this.shader.pixel__.set(0,1 / tmp.height,null,null);
		this.engine.setTarget(src);
		this.render();
		this.engine.setTarget(null);
		if(alloc) tmp.dispose();
	}
	,__class__: h3d.pass.Blur
	,__properties__: {set_sigma:"set_sigma",set_quality:"set_quality"}
});
h3d.pass.Clear = function() {
	h3d.pass.ScreenFx.call(this,new h3d.shader.Clear());
};
$hxClasses["h3d.pass.Clear"] = h3d.pass.Clear;
h3d.pass.Clear.__name__ = true;
h3d.pass.Clear.__super__ = h3d.pass.ScreenFx;
h3d.pass.Clear.prototype = $extend(h3d.pass.ScreenFx.prototype,{
	apply: function(color,depth) {
		this.pass.depth(depth != null,h3d.mat.Compare.Always);
		if(depth != null) this.shader.depth__ = depth; else this.shader.depth__ = 0;
		if(color != null) {
			this.shader.color__.load(color);
			this.pass.set_colorMask(15);
		} else this.pass.set_colorMask(0);
		this.render();
	}
	,__class__: h3d.pass.Clear
});
h3d.pass.Distance = function() {
	h3d.pass.Base.call(this);
	this.priority = 10;
	this.lightSystem = null;
};
$hxClasses["h3d.pass.Distance"] = h3d.pass.Distance;
h3d.pass.Distance.__name__ = true;
h3d.pass.Distance.__super__ = h3d.pass.Base;
h3d.pass.Distance.prototype = $extend(h3d.pass.Base.prototype,{
	getOutputs: function() {
		return ["output.position","output.distance"];
	}
	,draw: function(ctx,passes) {
		if(this.texture == null || this.texture.width != ctx.engine.width || this.texture.height != ctx.engine.height) {
			if(this.texture != null) this.texture.dispose();
			this.texture = new h3d.mat.Texture(ctx.engine.width,ctx.engine.height,[h3d.mat.TextureFlags.Target,h3d.mat.TextureFlags.TargetDepth,h3d.mat.TextureFlags.TargetNoFlipY]);
		}
		ctx.engine.setTarget(this.texture);
		passes = h3d.pass.Base.prototype.draw.call(this,ctx,passes);
		ctx.engine.setTarget(null);
		return passes;
	}
	,__class__: h3d.pass.Distance
});
h3d.pass.LightSystem = function(globals) {
	this.maxLightsPerObject = 6;
	this.globals = globals;
	this.initGlobals();
	this.cachedShaderList = [];
	this.set_ambientLight(new h3d.Vector(1,1,1));
	this.ambientShader = new h3d.shader.AmbientLight();
};
$hxClasses["h3d.pass.LightSystem"] = h3d.pass.LightSystem;
h3d.pass.LightSystem.__name__ = true;
h3d.pass.LightSystem.prototype = {
	initLights: function(lights) {
		this.lights = lights;
		this.lightCount = 0;
		var l = lights;
		while(l != null) {
			this.lightCount++;
			l.objectDistance = 0.;
			l = l.next;
		}
		if(this.lightCount <= this.maxLightsPerObject) lights = haxe.ds.ListSort.sortSingleLinked(lights,$bind(this,this.sortLight));
		this.setGlobals();
	}
	,sortLight: function(l1,l2) {
		var p = l1.priority - l2.priority;
		if(p != 0) return -p;
		if(l1.objectDistance < l2.objectDistance) return -1; else return 1;
	}
	,computeLight: function(obj,shaders) {
		var _g = this;
		if(this.lightCount > this.maxLightsPerObject) {
			var l = this.lights;
			while(l != null) {
				l.objectDistance = hxd.Math.distanceSq(l.absPos._41 - obj.absPos._41,l.absPos._42 - obj.absPos._42,l.absPos._43 - obj.absPos._43);
				l = l.next;
			}
			this.lights = haxe.ds.ListSort.sortSingleLinked(this.lights,$bind(this,this.sortLight));
		}
		var k = 0;
		var sl = _g.cachedShaderList[k++];
		if(sl == null) {
			sl = new hxsl.ShaderList(null);
			_g.cachedShaderList[k - 1] = sl;
		}
		sl.s = this.ambientShader;
		sl.next = shaders;
		shaders = sl;
		var l1 = this.lights;
		var i = 0;
		while(l1 != null) {
			if(i++ == this.maxLightsPerObject) break;
			var sl1 = _g.cachedShaderList[k++];
			if(sl1 == null) {
				sl1 = new hxsl.ShaderList(null);
				_g.cachedShaderList[k - 1] = sl1;
			}
			sl1.s = l1.shader;
			sl1.next = shaders;
			shaders = sl1;
			l1 = l1.next;
		}
		return shaders;
	}
	,set_ambientLight: function(v) {
		this.globals.fastSet(this.ambientLight_id,v);
		return v;
	}
	,initGlobals: function() {
		var this1;
		this1 = hxsl.Globals.allocID("global.ambientLight");
		this.ambientLight_id = this1;
		var this2;
		this2 = hxsl.Globals.allocID("global.perPixelLighting");
		this.perPixelLighting_id = this2;
	}
	,setGlobals: function() {
	}
	,__class__: h3d.pass.LightSystem
	,__properties__: {set_ambientLight:"set_ambientLight"}
};
h3d.pass.Object = function() {
	this.shaders = [];
};
$hxClasses["h3d.pass.Object"] = h3d.pass.Object;
h3d.pass.Object.__name__ = true;
h3d.pass.Object.prototype = {
	__class__: h3d.pass.Object
};
var hxsl = {};
hxsl.Shader = function() {
	var cl = Type.getClass(this);
	this.shader = cl.SHADER;
	this.constModified = true;
	if(this.shader == null) {
		this.shader = new hxsl.SharedShader(cl.SRC);
		cl.SHADER = this.shader;
	}
};
$hxClasses["hxsl.Shader"] = hxsl.Shader;
hxsl.Shader.__name__ = true;
hxsl.Shader.prototype = {
	getParamValue: function(index) {
		throw "assert";
		return null;
	}
	,updateConstants: function(globals) {
		var _g = 0;
		var _g1 = this.shader.consts;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			if(c.globalId > 0) {
				var v = globals.map.get(c.globalId);
				var _g2 = c.v.type;
				switch(_g2[1]) {
				case 1:
					var v1 = v;
					if(v1 >>> c.bits != 0) throw "Constant " + c.v.name + " is outside range (" + v1 + " > " + ((1 << c.bits) - 1) + ")";
					this.constBits |= v1 << c.pos;
					break;
				case 2:
					var v2 = v;
					if(v2) this.constBits |= 1 << c.pos;
					break;
				default:
					throw "assert";
				}
			}
		}
		this.instance = this.shader.getInstance(this.constBits);
	}
	,__class__: hxsl.Shader
};
h3d.shader = {};
h3d.shader.Shadow = function() { };
$hxClasses["h3d.shader.Shadow"] = h3d.shader.Shadow;
h3d.shader.Shadow.__name__ = true;
h3d.shader.Shadow.__super__ = hxsl.Shader;
h3d.shader.Shadow.prototype = $extend(hxsl.Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		hxsl.Shader.prototype.updateConstants.call(this,globals);
	}
	,getParamValue: function(index) {
		return null;
	}
	,__class__: h3d.shader.Shadow
});
hxsl.SharedShader = function(src) {
	this.instanceCache = new haxe.ds.IntMap();
	this.data = haxe.Unserializer.run(src);
	this.consts = [];
	this.globals = [];
	var _g = 0;
	var _g1 = this.data.vars;
	while(_g < _g1.length) {
		var v = _g1[_g];
		++_g;
		this.browseVar(v);
	}
	if(this.consts.length == 0) {
		var i = new hxsl.ShaderInstance(this.data);
		this.paramsCount = 0;
		var _g2 = 0;
		var _g11 = this.data.vars;
		while(_g2 < _g11.length) {
			var v1 = _g11[_g2];
			++_g2;
			this.addSelfParam(i,v1);
		}
		this.instanceCache.set(0,i);
	}
};
$hxClasses["hxsl.SharedShader"] = hxsl.SharedShader;
hxsl.SharedShader.__name__ = true;
hxsl.SharedShader.prototype = {
	getInstance: function(constBits) {
		var i = this.instanceCache.get(constBits);
		if(i != null) return i;
		var $eval = new hxsl.Eval();
		var _g = 0;
		var _g1 = this.consts;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			$eval.setConstant(c.v,(function($this) {
				var $r;
				var _g2 = c.v.type;
				$r = (function($this) {
					var $r;
					switch(_g2[1]) {
					case 2:
						$r = hxsl.Const.CBool((constBits >>> c.pos & 1) != 0);
						break;
					case 1:
						$r = hxsl.Const.CInt(constBits >>> c.pos & (1 << c.bits) - 1);
						break;
					default:
						$r = (function($this) {
							var $r;
							throw "assert";
							return $r;
						}($this));
					}
					return $r;
				}($this));
				return $r;
			}(this)));
		}
		i = new hxsl.ShaderInstance($eval["eval"](this.data));
		this.paramsCount = 0;
		var _g3 = 0;
		var _g11 = this.data.vars;
		while(_g3 < _g11.length) {
			var v = _g11[_g3];
			++_g3;
			this.addParam($eval,i,v);
		}
		this.instanceCache.set(constBits,i);
		return i;
	}
	,addSelfParam: function(i,v) {
		{
			var _g = v.type;
			switch(_g[1]) {
			case 12:
				var vl = _g[2];
				var _g1 = 0;
				while(_g1 < vl.length) {
					var v1 = vl[_g1];
					++_g1;
					this.addSelfParam(i,v1);
				}
				break;
			default:
				if(v.kind == hxsl.VarKind.Param) {
					i.params.set(v.id,this.paramsCount);
					this.paramsCount++;
				}
			}
		}
	}
	,addParam: function($eval,i,v) {
		{
			var _g = v.type;
			switch(_g[1]) {
			case 12:
				var vl = _g[2];
				var _g1 = 0;
				while(_g1 < vl.length) {
					var v1 = vl[_g1];
					++_g1;
					this.addParam($eval,i,v1);
				}
				break;
			default:
				if(v.kind == hxsl.VarKind.Param) {
					i.params.set($eval.varMap.h[v.__id__].id,this.paramsCount);
					this.paramsCount++;
				}
			}
		}
	}
	,browseVar: function(v,path) {
		v.id = hxsl.Tools.allocVarId();
		if(path == null) path = hxsl.Tools.getName(v); else path += "." + v.name;
		{
			var _g = v.type;
			switch(_g[1]) {
			case 12:
				var vl = _g[2];
				var _g1 = 0;
				while(_g1 < vl.length) {
					var vs = vl[_g1];
					++_g1;
					this.browseVar(vs,path);
				}
				break;
			default:
				var globalId = 0;
				if(v.kind == hxsl.VarKind.Global) {
					globalId = hxsl.Globals.allocID(path);
					this.globals.push(new hxsl.ShaderGlobal(v,globalId));
				}
				if(!hxsl.Tools.isConst(v)) return;
				var bits = hxsl.Tools.getConstBits(v);
				if(bits > 0) {
					var prev = this.consts[this.consts.length - 1];
					var pos;
					if(prev == null) pos = 0; else pos = prev.pos + prev.bits;
					var c = new hxsl.ShaderConst(v,pos,bits);
					c.globalId = globalId;
					this.consts.push(c);
				}
			}
		}
	}
	,__class__: hxsl.SharedShader
};
hxsl.ShaderInstance = function(shader) {
	this.id = hxsl.Tools.allocVarId();
	this.shader = shader;
	this.params = new haxe.ds.IntMap();
};
$hxClasses["hxsl.ShaderInstance"] = hxsl.ShaderInstance;
hxsl.ShaderInstance.__name__ = true;
hxsl.ShaderInstance.prototype = {
	__class__: hxsl.ShaderInstance
};
hxsl.Component = $hxClasses["hxsl.Component"] = { __ename__ : true, __constructs__ : ["X","Y","Z","W"] };
hxsl.Component.X = ["X",0];
hxsl.Component.X.toString = $estr;
hxsl.Component.X.__enum__ = hxsl.Component;
hxsl.Component.Y = ["Y",1];
hxsl.Component.Y.toString = $estr;
hxsl.Component.Y.__enum__ = hxsl.Component;
hxsl.Component.Z = ["Z",2];
hxsl.Component.Z.toString = $estr;
hxsl.Component.Z.__enum__ = hxsl.Component;
hxsl.Component.W = ["W",3];
hxsl.Component.W.toString = $estr;
hxsl.Component.W.__enum__ = hxsl.Component;
hxsl.Component.__empty_constructs__ = [hxsl.Component.X,hxsl.Component.Y,hxsl.Component.Z,hxsl.Component.W];
hxsl.Tools = function() { };
$hxClasses["hxsl.Tools"] = hxsl.Tools;
hxsl.Tools.__name__ = true;
hxsl.Tools.allocVarId = function() {
	return ++hxsl.Tools.UID;
};
hxsl.Tools.getName = function(v) {
	if(v.qualifiers == null) return v.name;
	var _g = 0;
	var _g1 = v.qualifiers;
	while(_g < _g1.length) {
		var q = _g1[_g];
		++_g;
		switch(q[1]) {
		case 4:
			var n = q[2];
			return n;
		default:
		}
	}
	return v.name;
};
hxsl.Tools.getConstBits = function(v) {
	var _g = v.type;
	switch(_g[1]) {
	case 2:
		return 1;
	case 1:
		var _g1 = 0;
		var _g2 = v.qualifiers;
		while(_g1 < _g2.length) {
			var q = _g2[_g1];
			++_g1;
			switch(q[1]) {
			case 0:
				var n = q[2];
				if(n != null) {
					var bits = 0;
					while(n >= 1 << bits) bits++;
					return bits;
				}
				return 8;
			default:
			}
		}
		break;
	default:
	}
	return 0;
};
hxsl.Tools.isConst = function(v) {
	if(v.qualifiers != null) {
		var _g = 0;
		var _g1 = v.qualifiers;
		while(_g < _g1.length) {
			var q = _g1[_g];
			++_g;
			switch(q[1]) {
			case 0:
				return true;
			default:
			}
		}
	}
	return false;
};
hxsl.Tools.hasQualifier = function(v,q) {
	if(v.qualifiers != null) {
		var _g = 0;
		var _g1 = v.qualifiers;
		while(_g < _g1.length) {
			var q2 = _g1[_g];
			++_g;
			if(q2 == q) return true;
		}
	}
	return false;
};
hxsl.Tools.toString = function(t) {
	switch(t[1]) {
	case 5:
		var t1 = t[3];
		var size = t[2];
		var prefix;
		switch(t1[1]) {
		case 1:
			prefix = "";
			break;
		case 0:
			prefix = "I";
			break;
		case 2:
			prefix = "B";
			break;
		}
		return prefix + "Vec" + size;
	case 12:
		var vl = t[2];
		return "{" + ((function($this) {
			var $r;
			var _g = [];
			{
				var _g1 = 0;
				while(_g1 < vl.length) {
					var v = vl[_g1];
					++_g1;
					_g.push(v.name + " : " + hxsl.Tools.toString(v.type));
				}
			}
			$r = _g;
			return $r;
		}(this))).join(",") + "}";
	case 14:
		var s = t[3];
		var t2 = t[2];
		return hxsl.Tools.toString(t2) + "[" + (function($this) {
			var $r;
			switch(s[1]) {
			case 0:
				$r = (function($this) {
					var $r;
					var i = s[2];
					$r = "" + i;
					return $r;
				}($this));
				break;
			case 1:
				$r = (function($this) {
					var $r;
					var v1 = s[2];
					$r = v1.name;
					return $r;
				}($this));
				break;
			}
			return $r;
		}(this)) + "]";
	default:
		return HxOverrides.substr(t[0],1,null);
	}
};
hxsl.Tools.iter = function(e,f) {
	{
		var _g = e.e;
		switch(_g[1]) {
		case 3:
			var e1 = _g[2];
			f(e1);
			break;
		case 4:
			var el = _g[2];
			var _g1 = 0;
			while(_g1 < el.length) {
				var e2 = el[_g1];
				++_g1;
				f(e2);
			}
			break;
		case 5:
			var e21 = _g[4];
			var e11 = _g[3];
			f(e11);
			f(e21);
			break;
		case 6:
			var e12 = _g[3];
			f(e12);
			break;
		case 7:
			var init = _g[3];
			if(init != null) f(init);
			break;
		case 8:
			var args = _g[3];
			var e3 = _g[2];
			f(e3);
			var _g11 = 0;
			while(_g11 < args.length) {
				var a = args[_g11];
				++_g11;
				f(a);
			}
			break;
		case 9:
			var e4 = _g[2];
			f(e4);
			break;
		case 10:
			var eelse = _g[4];
			var eif = _g[3];
			var econd = _g[2];
			f(econd);
			f(eif);
			if(eelse != null) f(eelse);
			break;
		case 12:
			var e5 = _g[2];
			if(e5 != null) f(e5);
			break;
		case 13:
			var loop = _g[4];
			var it = _g[3];
			f(it);
			f(loop);
			break;
		case 16:
			var index = _g[3];
			var e6 = _g[2];
			f(e6);
			f(index);
			break;
		case 17:
			var el1 = _g[2];
			var _g12 = 0;
			while(_g12 < el1.length) {
				var e7 = el1[_g12];
				++_g12;
				f(e7);
			}
			break;
		case 0:case 1:case 2:case 11:case 14:case 15:
			break;
		}
	}
};
hxsl.Tools.map = function(e,f) {
	var ed;
	{
		var _g = e.e;
		switch(_g[1]) {
		case 3:
			var e1 = _g[2];
			ed = hxsl.TExprDef.TParenthesis(f(e1));
			break;
		case 4:
			var el = _g[2];
			ed = hxsl.TExprDef.TBlock((function($this) {
				var $r;
				var _g1 = [];
				{
					var _g2 = 0;
					while(_g2 < el.length) {
						var e2 = el[_g2];
						++_g2;
						_g1.push(f(e2));
					}
				}
				$r = _g1;
				return $r;
			}(this)));
			break;
		case 5:
			var e21 = _g[4];
			var e11 = _g[3];
			var op = _g[2];
			ed = hxsl.TExprDef.TBinop(op,f(e11),f(e21));
			break;
		case 6:
			var e12 = _g[3];
			var op1 = _g[2];
			ed = hxsl.TExprDef.TUnop(op1,f(e12));
			break;
		case 7:
			var init = _g[3];
			var v = _g[2];
			ed = hxsl.TExprDef.TVarDecl(v,init != null?f(init):null);
			break;
		case 8:
			var args = _g[3];
			var e3 = _g[2];
			ed = hxsl.TExprDef.TCall(f(e3),(function($this) {
				var $r;
				var _g11 = [];
				{
					var _g21 = 0;
					while(_g21 < args.length) {
						var a = args[_g21];
						++_g21;
						_g11.push(f(a));
					}
				}
				$r = _g11;
				return $r;
			}(this)));
			break;
		case 9:
			var c = _g[3];
			var e4 = _g[2];
			ed = hxsl.TExprDef.TSwiz(f(e4),c);
			break;
		case 10:
			var eelse = _g[4];
			var eif = _g[3];
			var econd = _g[2];
			ed = hxsl.TExprDef.TIf(f(econd),f(eif),eelse != null?f(eelse):null);
			break;
		case 12:
			var e5 = _g[2];
			ed = hxsl.TExprDef.TReturn(e5 != null?f(e5):null);
			break;
		case 13:
			var loop = _g[4];
			var it = _g[3];
			var v1 = _g[2];
			ed = hxsl.TExprDef.TFor(v1,f(it),f(loop));
			break;
		case 16:
			var index = _g[3];
			var e6 = _g[2];
			ed = hxsl.TExprDef.TArray(f(e6),f(index));
			break;
		case 17:
			var el1 = _g[2];
			ed = hxsl.TExprDef.TArrayDecl((function($this) {
				var $r;
				var _g12 = [];
				{
					var _g22 = 0;
					while(_g22 < el1.length) {
						var e7 = el1[_g22];
						++_g22;
						_g12.push(f(e7));
					}
				}
				$r = _g12;
				return $r;
			}(this)));
			break;
		case 0:case 1:case 2:case 11:case 14:case 15:
			ed = e.e;
			break;
		}
	}
	return { e : ed, t : e.t, p : e.p};
};
h3d.pass.ShadowMap = function(size) {
	this.bias = 0.01;
	this.power = 10.0;
	h3d.pass.Base.call(this);
	this.size = size;
	this.priority = 9;
	this.lightSystem = null;
	this.lightDirection = new h3d.Vector(0,0,-1);
	this.lightCamera = new h3d.Camera();
	this.lightCamera.orthoBounds = new h3d.col.Bounds();
	this.shadowMapId = hxsl.Globals.allocID("shadow.map");
	this.shadowProjId = hxsl.Globals.allocID("shadow.proj");
	this.shadowColorId = hxsl.Globals.allocID("shadow.color");
	this.shadowPowerId = hxsl.Globals.allocID("shadow.power");
	this.shadowBiasId = hxsl.Globals.allocID("shadow.bias");
	this.hasTargetDepth = h3d.Engine.CURRENT.driver.hasFeature(h3d.impl.Feature.TargetDepthBuffer);
	if(!this.hasTargetDepth) this.clear = new h3d.pass.Clear();
	this.color = new h3d.Vector();
	this.blur = new h3d.pass.Blur(2,3);
};
$hxClasses["h3d.pass.ShadowMap"] = h3d.pass.ShadowMap;
h3d.pass.ShadowMap.__name__ = true;
h3d.pass.ShadowMap.__super__ = h3d.pass.Base;
h3d.pass.ShadowMap.prototype = $extend(h3d.pass.Base.prototype,{
	getSceneBounds: function(bounds) {
		bounds.xMin = -10;
		bounds.yMin = -10;
		bounds.zMin = -10;
		bounds.xMax = 10;
		bounds.yMax = 10;
		bounds.zMax = 10;
	}
	,getOutputs: function() {
		return ["output.position","output.distance"];
	}
	,setGlobals: function() {
		h3d.pass.Base.prototype.setGlobals.call(this);
		this.lightCamera.orthoBounds.empty();
		this.getSceneBounds(this.lightCamera.orthoBounds);
		this.lightCamera.update();
		this.set_cameraViewProj(this.lightCamera.m);
	}
	,draw: function(ctx,passes) {
		if(this.texture == null || this.texture.width != this.size) {
			if(this.texture != null) {
				this.texture.dispose();
				this.blurTexture.dispose();
				this.blurTexture = null;
			}
			this.texture = new h3d.mat.Texture(this.size,this.size,[h3d.mat.TextureFlags.Target,this.hasTargetDepth?h3d.mat.TextureFlags.TargetDepth:h3d.mat.TextureFlags.TargetUseDefaultDepth,h3d.mat.TextureFlags.TargetNoFlipY]);
		}
		if(this.blur.quality > 0 && this.blurTexture == null) this.blurTexture = new h3d.mat.Texture(this.size,this.size,[h3d.mat.TextureFlags.Target,h3d.mat.TextureFlags.TargetNoFlipY]);
		var ct = ctx.camera.target;
		this.lightCamera.target.set(ct.x,ct.y,ct.z,null);
		this.lightCamera.pos.set(ct.x - this.lightDirection.x,ct.y - this.lightDirection.y,ct.z - this.lightDirection.z,null);
		ctx.engine.setTarget(this.texture,-1);
		passes = h3d.pass.Base.prototype.draw.call(this,ctx,passes);
		ctx.engine.setTarget(null);
		this.blur.apply(this.texture,this.blurTexture,true);
		if(!this.hasTargetDepth) this.clear.apply(null,1);
		ctx.sharedGlobals.set(this.shadowMapId,this.texture);
		ctx.sharedGlobals.set(this.shadowProjId,this.lightCamera.m);
		ctx.sharedGlobals.set(this.shadowColorId,this.color);
		ctx.sharedGlobals.set(this.shadowPowerId,this.power);
		ctx.sharedGlobals.set(this.shadowBiasId,this.bias);
		return passes;
	}
	,__class__: h3d.pass.ShadowMap
});
h3d.prim.Polygon = function(points,idx) {
	this.points = points;
	this.idx = idx;
};
$hxClasses["h3d.prim.Polygon"] = h3d.prim.Polygon;
h3d.prim.Polygon.__name__ = true;
h3d.prim.Polygon.__super__ = h3d.prim.Primitive;
h3d.prim.Polygon.prototype = $extend(h3d.prim.Primitive.prototype,{
	alloc: function(engine) {
		this.dispose();
		var size = 3;
		if(this.normals != null) size += 3;
		if(this.uvs != null) size += 2;
		if(this.colors != null) size += 3;
		var buf;
		var this1;
		this1 = new Array(0);
		buf = this1;
		var _g1 = 0;
		var _g = this.points.length;
		while(_g1 < _g) {
			var k = _g1++;
			var p = this.points[k];
			buf.push(p.x);
			buf.push(p.y);
			buf.push(p.z);
			if(this.uvs != null) {
				var t = this.uvs[k];
				buf.push(t.u);
				buf.push(t.v);
			}
			if(this.normals != null) {
				var n = this.normals[k];
				buf.push(n.x);
				buf.push(n.y);
				buf.push(n.z);
			}
			if(this.colors != null) {
				var c = this.colors[k];
				buf.push(c.x);
				buf.push(c.y);
				buf.push(c.z);
			}
		}
		this.buffer = h3d.Buffer.ofFloats(buf,size,this.idx == null?[h3d.BufferFlag.Triangles]:null);
		if(this.idx != null) this.indexes = h3d.Indexes.alloc(this.idx);
	}
	,unindex: function() {
		if(this.idx != null && this.points.length != this.idx.length) {
			var p = [];
			var used = [];
			var _g1 = 0;
			var _g = this.idx.length;
			while(_g1 < _g) {
				var i = _g1++;
				p.push(this.points[this.idx[i]].clone());
			}
			if(this.normals != null) {
				var n = [];
				var _g11 = 0;
				var _g2 = this.idx.length;
				while(_g11 < _g2) {
					var i1 = _g11++;
					n.push(this.normals[this.idx[i1]].clone());
				}
				this.normals = n;
			}
			if(this.colors != null) {
				var n1 = [];
				var _g12 = 0;
				var _g3 = this.idx.length;
				while(_g12 < _g3) {
					var i2 = _g12++;
					n1.push(this.colors[this.idx[i2]].clone());
				}
				this.colors = n1;
			}
			if(this.uvs != null) {
				var t = [];
				var _g13 = 0;
				var _g4 = this.idx.length;
				while(_g13 < _g4) {
					var i3 = _g13++;
					t.push(this.uvs[this.idx[i3]].clone());
				}
				this.uvs = t;
			}
			this.points = p;
			this.idx = null;
		}
	}
	,addNormals: function() {
		this.normals = new Array();
		var _g1 = 0;
		var _g = this.points.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.normals[i] = new h3d.col.Point();
		}
		var pos = 0;
		var _g11 = 0;
		var _g2 = this.triCount();
		while(_g11 < _g2) {
			var i1 = _g11++;
			var i0;
			var i11;
			var i2;
			if(this.idx == null) {
				i0 = pos++;
				i11 = pos++;
				i2 = pos++;
			} else {
				var key = pos++;
				i0 = this.idx[key];
				var key1 = pos++;
				i11 = this.idx[key1];
				var key2 = pos++;
				i2 = this.idx[key2];
			}
			var p0 = this.points[i0];
			var p1 = this.points[i11];
			var p2 = this.points[i2];
			var n = new h3d.col.Point(p1.x - p0.x,p1.y - p0.y,p1.z - p0.z).cross(new h3d.col.Point(p2.x - p0.x,p2.y - p0.y,p2.z - p0.z));
			this.normals[i0].x += n.x;
			this.normals[i0].y += n.y;
			this.normals[i0].z += n.z;
			this.normals[i11].x += n.x;
			this.normals[i11].y += n.y;
			this.normals[i11].z += n.z;
			this.normals[i2].x += n.x;
			this.normals[i2].y += n.y;
			this.normals[i2].z += n.z;
		}
		var _g3 = 0;
		var _g12 = this.normals;
		while(_g3 < _g12.length) {
			var n1 = _g12[_g3];
			++_g3;
			n1.normalize();
		}
	}
	,triCount: function() {
		var n = h3d.prim.Primitive.prototype.triCount.call(this);
		if(n != 0) return n;
		return (this.idx == null?this.points.length:this.idx.length) / 3 | 0;
	}
	,__class__: h3d.prim.Polygon
});
h3d.prim.Cube = function(x,y,z) {
	if(z == null) z = 1.;
	if(y == null) y = 1.;
	if(x == null) x = 1.;
	var p = [new h3d.col.Point(0,0,0),new h3d.col.Point(x,0,0),new h3d.col.Point(0,y,0),new h3d.col.Point(0,0,z),new h3d.col.Point(x,y,0),new h3d.col.Point(x,0,z),new h3d.col.Point(0,y,z),new h3d.col.Point(x,y,z)];
	var idx;
	var this1;
	this1 = new Array(0);
	idx = this1;
	idx.push(0);
	idx.push(1);
	idx.push(5);
	idx.push(0);
	idx.push(5);
	idx.push(3);
	idx.push(1);
	idx.push(4);
	idx.push(7);
	idx.push(1);
	idx.push(7);
	idx.push(5);
	idx.push(3);
	idx.push(5);
	idx.push(7);
	idx.push(3);
	idx.push(7);
	idx.push(6);
	idx.push(0);
	idx.push(6);
	idx.push(2);
	idx.push(0);
	idx.push(3);
	idx.push(6);
	idx.push(2);
	idx.push(7);
	idx.push(4);
	idx.push(2);
	idx.push(6);
	idx.push(7);
	idx.push(0);
	idx.push(4);
	idx.push(1);
	idx.push(0);
	idx.push(2);
	idx.push(4);
	h3d.prim.Polygon.call(this,p,idx);
};
$hxClasses["h3d.prim.Cube"] = h3d.prim.Cube;
h3d.prim.Cube.__name__ = true;
h3d.prim.Cube.__super__ = h3d.prim.Polygon;
h3d.prim.Cube.prototype = $extend(h3d.prim.Polygon.prototype,{
	addUVs: function() {
		this.unindex();
		var z = new h3d.prim.UV(0,0);
		var x = new h3d.prim.UV(1,0);
		var y = new h3d.prim.UV(0,1);
		var o = new h3d.prim.UV(1,1);
		this.uvs = [z,x,o,z,o,y,x,z,y,x,y,o,z,x,o,z,o,y,z,o,x,z,y,o,x,y,z,x,o,y,z,o,x,z,y,o];
	}
	,__class__: h3d.prim.Cube
});
h3d.prim.MeshPrimitive = function() { };
$hxClasses["h3d.prim.MeshPrimitive"] = h3d.prim.MeshPrimitive;
h3d.prim.MeshPrimitive.__name__ = true;
h3d.prim.MeshPrimitive.hash = function(name) {
	var id = 0;
	var _g1 = 0;
	var _g = name.length;
	while(_g1 < _g) {
		var i = _g1++;
		id = id * 223 + HxOverrides.cca(name,i);
	}
	return id & 268435455;
};
h3d.prim.MeshPrimitive.__super__ = h3d.prim.Primitive;
h3d.prim.MeshPrimitive.prototype = $extend(h3d.prim.Primitive.prototype,{
	allocBuffer: function(engine,name) {
		return null;
	}
	,addBuffer: function(name,buf,offset) {
		if(offset == null) offset = 0;
		if(this.bufferCache == null) this.bufferCache = new haxe.ds.IntMap();
		var id = h3d.prim.MeshPrimitive.hash(name);
		var old = this.bufferCache.get(id);
		if(old != null) old.dispose();
		var value = new h3d.BufferOffset(buf,offset);
		this.bufferCache.set(id,value);
	}
	,dispose: function() {
		h3d.prim.Primitive.prototype.dispose.call(this);
		if(this.bufferCache != null) {
			var $it0 = this.bufferCache.iterator();
			while( $it0.hasNext() ) {
				var b = $it0.next();
				b.dispose();
			}
		}
		this.bufferCache = null;
	}
	,getBuffers: function(engine) {
		if(this.bufferCache == null) this.bufferCache = new haxe.ds.IntMap();
		var buffers = null;
		var prev = null;
		var _g = 0;
		var _g1 = engine.driver.getShaderInputNames();
		while(_g < _g1.length) {
			var name = _g1[_g];
			++_g;
			var id = h3d.prim.MeshPrimitive.hash(name);
			var b = this.bufferCache.get(id);
			if(b == null) {
				b = this.allocBuffer(engine,name);
				if(b == null) throw "Buffer " + name + " is not available";
				this.bufferCache.set(id,b);
			}
			b.next = null;
			if(prev == null) buffers = prev = b; else {
				prev.next = b;
				prev = b;
			}
		}
		return buffers;
	}
	,render: function(engine) {
		if(this.indexes == null || this.indexes.isDisposed()) this.alloc(engine);
		engine.renderMultiBuffers(this.getBuffers(engine),this.indexes);
	}
	,__class__: h3d.prim.MeshPrimitive
});
h3d.prim.FBXModel = function(g) {
	this.geom = g;
	this.curMaterial = -1;
};
$hxClasses["h3d.prim.FBXModel"] = h3d.prim.FBXModel;
h3d.prim.FBXModel.__name__ = true;
h3d.prim.FBXModel.__super__ = h3d.prim.MeshPrimitive;
h3d.prim.FBXModel.prototype = $extend(h3d.prim.MeshPrimitive.prototype,{
	render: function(engine) {
		if(this.curMaterial < 0) {
			h3d.prim.MeshPrimitive.prototype.render.call(this,engine);
			return;
		}
		if(this.indexes == null || this.indexes.isDisposed()) this.alloc(engine);
		var idx = this.indexes;
		this.indexes = this.groupIndexes[this.curMaterial];
		if(this.indexes != null) h3d.prim.MeshPrimitive.prototype.render.call(this,engine);
		this.indexes = idx;
		this.curMaterial = -1;
	}
	,dispose: function() {
		h3d.prim.MeshPrimitive.prototype.dispose.call(this);
		if(this.groupIndexes != null) {
			var _g = 0;
			var _g1 = this.groupIndexes;
			while(_g < _g1.length) {
				var i = _g1[_g];
				++_g;
				if(i != null) i.dispose();
			}
			this.groupIndexes = null;
		}
	}
	,alloc: function(engine) {
		this.dispose();
		var verts = this.geom.getVertices();
		var norms = this.geom.getNormals();
		var tuvs = this.geom.getUVs()[0];
		var colors = this.geom.getColors();
		var mats;
		if(this.multiMaterial) mats = this.geom.getMaterials(); else mats = null;
		var gt = this.geom.getGeomTranslate();
		if(gt == null) gt = new h3d.col.Point();
		var idx;
		var this1;
		this1 = new Array(0);
		idx = this1;
		var midx = new Array();
		var pbuf;
		var this2;
		this2 = new Array(0);
		pbuf = this2;
		var nbuf;
		if(norms == null) nbuf = null; else {
			var this3;
			this3 = new Array(0);
			nbuf = this3;
		}
		var sbuf;
		if(this.skin == null) sbuf = null; else sbuf = new haxe.io.BytesOutput();
		var tbuf;
		if(tuvs == null) tbuf = null; else {
			var this4;
			this4 = new Array(0);
			tbuf = this4;
		}
		var cbuf;
		if(colors == null) cbuf = null; else {
			var this5;
			this5 = new Array(0);
			cbuf = this5;
		}
		var sidx = null;
		var stri = 0;
		if(this.skin != null && this.skin.splitJoints != null) {
			if(this.multiMaterial) throw "Multimaterial not supported with skin split";
			var _g = [];
			var _g1 = 0;
			var _g2 = this.skin.splitJoints;
			while(_g1 < _g2.length) {
				var _ = _g2[_g1];
				++_g1;
				_g.push((function($this) {
					var $r;
					var this6;
					this6 = new Array(0);
					$r = this6;
					return $r;
				}(this)));
			}
			sidx = _g;
		}
		var count = 0;
		var pos = 0;
		var matPos = 0;
		var index = this.geom.getPolygons();
		var _g3 = 0;
		while(_g3 < index.length) {
			var i = index[_g3];
			++_g3;
			count++;
			if(i < 0) {
				index[pos] = -i - 1;
				var start = pos - count + 1;
				var _g11 = 0;
				while(_g11 < count) {
					var n = _g11++;
					var k = n + start;
					var vidx = index[k];
					var x = verts[vidx * 3] + gt.x;
					var y = verts[vidx * 3 + 1] + gt.y;
					var z = verts[vidx * 3 + 2] + gt.z;
					pbuf.push(x);
					pbuf.push(y);
					pbuf.push(z);
					if(nbuf != null) {
						nbuf.push(norms[k * 3]);
						nbuf.push(norms[k * 3 + 1]);
						nbuf.push(norms[k * 3 + 2]);
					}
					if(tbuf != null) {
						var iuv = tuvs.index[k];
						tbuf.push(tuvs.values[iuv * 2]);
						tbuf.push(1 - tuvs.values[iuv * 2 + 1]);
					}
					if(sbuf != null) {
						var p = vidx * this.skin.bonesPerVertex;
						var idx1 = 0;
						var _g31 = 0;
						var _g21 = this.skin.bonesPerVertex;
						while(_g31 < _g21) {
							var i1 = _g31++;
							sbuf.writeFloat(this.skin.vertexWeights[p + i1]);
							idx1 = this.skin.vertexJoints[p + i1] << 8 * i1 | idx1;
						}
						sbuf.writeInt32(idx1);
					}
					if(cbuf != null) {
						var icol = colors.index[k];
						cbuf.push(colors.values[icol * 4]);
						cbuf.push(colors.values[icol * 4 + 1]);
						cbuf.push(colors.values[icol * 4 + 2]);
					}
				}
				var _g22 = 0;
				var _g12 = count - 2;
				while(_g22 < _g12) {
					var n1 = _g22++;
					idx.push(start + n1);
					idx.push(start + count - 1);
					idx.push(start + n1 + 1);
				}
				if(this.skin != null && this.skin.splitJoints != null) {
					var _g23 = 0;
					var _g13 = count - 2;
					while(_g23 < _g13) {
						var n2 = _g23++;
						var idx2 = sidx[(function($this) {
							var $r;
							var index1 = stri++;
							$r = $this.skin.triangleGroups[index1];
							return $r;
						}(this))];
						idx2.push(start + n2);
						idx2.push(start + count - 1);
						idx2.push(start + n2 + 1);
					}
				}
				if(mats != null) {
					var mid = mats[matPos++];
					var idx3 = midx[mid];
					if(idx3 == null) {
						var this7;
						this7 = new Array(0);
						idx3 = this7;
						midx[mid] = idx3;
					}
					var _g24 = 0;
					var _g14 = count - 2;
					while(_g24 < _g14) {
						var n3 = _g24++;
						idx3.push(start + n3);
						idx3.push(start + count - 1);
						idx3.push(start + n3 + 1);
					}
				}
				index[pos] = i;
				count = 0;
			}
			pos++;
		}
		this.addBuffer("position",h3d.Buffer.ofFloats(pbuf,3));
		if(nbuf != null) this.addBuffer("normal",h3d.Buffer.ofFloats(nbuf,3));
		if(tbuf != null) this.addBuffer("uv",h3d.Buffer.ofFloats(tbuf,2));
		if(sbuf != null) {
			var nverts = sbuf.b.b.length / ((this.skin.bonesPerVertex + 1) * 4) | 0;
			var skinBuf = new h3d.Buffer(nverts,this.skin.bonesPerVertex + 1);
			skinBuf.uploadBytes(sbuf.getBytes(),0,nverts);
			this.addBuffer("weights",skinBuf,0);
			this.addBuffer("indexes",skinBuf,this.skin.bonesPerVertex);
		}
		if(cbuf != null) this.addBuffer("color",h3d.Buffer.ofFloats(cbuf,3));
		this.indexes = h3d.Indexes.alloc(idx);
		if(mats != null) {
			this.groupIndexes = [];
			var _g4 = 0;
			while(_g4 < midx.length) {
				var i2 = midx[_g4];
				++_g4;
				this.groupIndexes.push(i2 == null?null:h3d.Indexes.alloc(i2));
			}
		}
		if(sidx != null) {
			this.groupIndexes = [];
			var _g5 = 0;
			while(_g5 < sidx.length) {
				var i3 = sidx[_g5];
				++_g5;
				this.groupIndexes.push(i3 == null?null:h3d.Indexes.alloc(i3));
			}
		}
	}
	,__class__: h3d.prim.FBXModel
});
h3d.prim.Plan2D = function() {
};
$hxClasses["h3d.prim.Plan2D"] = h3d.prim.Plan2D;
h3d.prim.Plan2D.__name__ = true;
h3d.prim.Plan2D.__super__ = h3d.prim.Primitive;
h3d.prim.Plan2D.prototype = $extend(h3d.prim.Primitive.prototype,{
	alloc: function(engine) {
		var v;
		var this1;
		this1 = new Array(0);
		v = this1;
		v.push(-1);
		v.push(-1);
		v.push(0);
		v.push(1);
		v.push(-1);
		v.push(1);
		v.push(0);
		v.push(0);
		v.push(1);
		v.push(-1);
		v.push(1);
		v.push(1);
		v.push(1);
		v.push(1);
		v.push(1);
		v.push(0);
		this.buffer = h3d.Buffer.ofFloats(v,4,[h3d.BufferFlag.Quads]);
	}
	,render: function(engine) {
		if(this.buffer == null) this.alloc(engine);
		engine.renderBuffer(this.buffer,engine.mem.quadIndexes,2,0,-1);
	}
	,__class__: h3d.prim.Plan2D
});
h3d.prim.UV = function(u,v) {
	this.u = u;
	this.v = v;
};
$hxClasses["h3d.prim.UV"] = h3d.prim.UV;
h3d.prim.UV.__name__ = true;
h3d.prim.UV.prototype = {
	clone: function() {
		return new h3d.prim.UV(this.u,this.v);
	}
	,__class__: h3d.prim.UV
};
h3d.scene.Mesh = function(prim,mat,parent) {
	h3d.scene.Object.call(this,parent);
	this.primitive = prim;
	if(mat == null) mat = new h3d.mat.MeshMaterial(null);
	this.material = mat;
};
$hxClasses["h3d.scene.Mesh"] = h3d.scene.Mesh;
h3d.scene.Mesh.__name__ = true;
h3d.scene.Mesh.__super__ = h3d.scene.Object;
h3d.scene.Mesh.prototype = $extend(h3d.scene.Object.prototype,{
	draw: function(ctx) {
		this.primitive.render(ctx.engine);
	}
	,emit: function(ctx) {
		ctx.emit(this.material,this,null);
	}
	,__class__: h3d.scene.Mesh
});
h3d.scene.Light = function() {
	this.priority = 0;
};
$hxClasses["h3d.scene.Light"] = h3d.scene.Light;
h3d.scene.Light.__name__ = true;
h3d.scene.Light.__super__ = h3d.scene.Object;
h3d.scene.Light.prototype = $extend(h3d.scene.Object.prototype,{
	emit: function(ctx) {
		ctx.emitLight(this);
	}
	,__class__: h3d.scene.Light
});
h3d.scene.RenderContext = function() {
	this.frame = 0;
	this.time = 0.;
	this.elapsedTime = 1. / hxd.Stage.getInstance().getFrameRate();
};
$hxClasses["h3d.scene.RenderContext"] = h3d.scene.RenderContext;
h3d.scene.RenderContext.__name__ = true;
h3d.scene.RenderContext.prototype = {
	emit: function(mat,obj,index) {
		if(index == null) index = 0;
		var p = mat.passes;
		while(p != null) {
			this.emitPass(p,obj).index = index;
			p = p.nextPass;
		}
	}
	,start: function() {
		this.sharedGlobals = new haxe.ds.IntMap();
		this.lights = null;
		this.drawPass = null;
		this.passes = null;
		this.lights = null;
		this.time += this.elapsedTime;
		this.frame++;
	}
	,emitPass: function(pass,obj) {
		var o = this.pool;
		if(o == null) o = new h3d.pass.Object(); else this.pool = o.next;
		o.pass = pass;
		o.obj = obj;
		o.next = this.passes;
		this.passes = o;
		return o;
	}
	,emitLight: function(l) {
		l.next = this.lights;
		this.lights = l;
	}
	,done: function() {
		this.drawPass = null;
		var p = this.passes;
		var prev = null;
		while(p != null) {
			p.obj = null;
			p.pass = null;
			p.shader = null;
			p.index = 0;
			var _g1 = 0;
			var _g = p.shaders.length;
			while(_g1 < _g) {
				var i = _g1++;
				p.shaders[i] = null;
			}
			prev = p;
			p = p.next;
		}
		if(prev != null) {
			prev.next = this.pool;
			this.pool = this.passes;
		}
		this.passes = null;
		this.lights = null;
	}
	,__class__: h3d.scene.RenderContext
};
h3d.scene.Scene = function() {
	h3d.scene.Object.call(this,null);
	this.camera = new h3d.Camera();
	this.ctx = new h3d.scene.RenderContext();
	this.passes = new haxe.ds.StringMap();
	this.postPasses = [];
	this.prePasses = [];
};
$hxClasses["h3d.scene.Scene"] = h3d.scene.Scene;
h3d.scene.Scene.__name__ = true;
h3d.scene.Scene.__interfaces__ = [h3d.IDrawable];
h3d.scene.Scene.__super__ = h3d.scene.Object;
h3d.scene.Scene.prototype = $extend(h3d.scene.Object.prototype,{
	addPass: function(p,before) {
		if(before == null) before = false;
		if(before) this.prePasses.push(p); else this.postPasses.push(p);
	}
	,setElapsedTime: function(elapsedTime) {
		this.ctx.elapsedTime = elapsedTime;
	}
	,createDefaultPass: function(name) {
		switch(name) {
		case "default":case "alpha":case "additive":
			return new h3d.pass.Base();
		case "distance":
			return new h3d.pass.Distance();
		case "shadow":
			return new h3d.pass.ShadowMap(1024);
		default:
			throw "Don't know how to create pass '" + name + "', use s3d.setRenderPass()";
			return null;
		}
	}
	,getPass: function(name) {
		var p = this.passes.get(name);
		if(p == null) {
			p = this.createDefaultPass(name);
			this.setPass(name,p);
		}
		return p;
	}
	,setPass: function(name,p) {
		this.passes.set(name,p);
	}
	,render: function(engine) {
		this.camera.screenRatio = engine.width / engine.height;
		this.camera.update();
		var oldProj = engine.curProjMatrix;
		engine.curProjMatrix = this.camera.m;
		this.ctx.camera = this.camera;
		this.ctx.engine = engine;
		this.ctx.start();
		var _g = 0;
		var _g1 = this.prePasses;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			p.render(engine);
		}
		this.sync(this.ctx);
		this.emitRec(this.ctx);
		this.ctx.passes = haxe.ds.ListSort.sortSingleLinked(this.ctx.passes,function(p1,p2) {
			return p1.pass.passId - p2.pass.passId;
		});
		var curPass = this.ctx.passes;
		var passes = [];
		while(curPass != null) {
			var passId = curPass.pass.passId;
			var p3 = curPass;
			var prev = null;
			while(p3 != null && p3.pass.passId == passId) {
				prev = p3;
				p3 = p3.next;
			}
			prev.next = null;
			var render = this.getPass(curPass.pass.name);
			passes.push({ render : render, pass : curPass});
			curPass = p3;
		}
		passes.sort(function(p11,p21) {
			return p21.render.priority - p11.render.priority;
		});
		var _g2 = 0;
		while(_g2 < passes.length) {
			var p4 = passes[_g2];
			++_g2;
			p4.pass = p4.render.draw(this.ctx,p4.pass);
		}
		var count = 0;
		var prev1 = null;
		var _g3 = 0;
		while(_g3 < passes.length) {
			var p5 = passes[_g3];
			++_g3;
			var p6 = p5.pass;
			if(prev1 != null) prev1.next = p6;
			while(p6 != null) {
				prev1 = p6;
				p6 = p6.next;
			}
		}
		if(passes.length > 0) this.ctx.passes = passes[0].pass;
		this.ctx.done();
		var _g4 = 0;
		var _g11 = this.postPasses;
		while(_g4 < _g11.length) {
			var p7 = _g11[_g4];
			++_g4;
			p7.render(engine);
		}
		engine.curProjMatrix = oldProj;
		this.ctx.camera = null;
		this.ctx.engine = null;
	}
	,__class__: h3d.scene.Scene
});
h3d.shader.AlphaMap = function() {
	this.uvDelta__ = new h3d.Vector();
	this.uvScale__ = new h3d.Vector();
};
$hxClasses["h3d.shader.AlphaMap"] = h3d.shader.AlphaMap;
h3d.shader.AlphaMap.__name__ = true;
h3d.shader.AlphaMap.__super__ = hxsl.Shader;
h3d.shader.AlphaMap.prototype = $extend(hxsl.Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		hxsl.Shader.prototype.updateConstants.call(this,globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.texture__;
		case 1:
			return this.uvScale__;
		case 2:
			return this.uvDelta__;
		default:
		}
		return null;
	}
	,__class__: h3d.shader.AlphaMap
});
h3d.shader.AmbientLight = function() {
	hxsl.Shader.call(this);
};
$hxClasses["h3d.shader.AmbientLight"] = h3d.shader.AmbientLight;
h3d.shader.AmbientLight.__name__ = true;
h3d.shader.AmbientLight.__super__ = hxsl.Shader;
h3d.shader.AmbientLight.prototype = $extend(hxsl.Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		hxsl.Shader.prototype.updateConstants.call(this,globals);
	}
	,getParamValue: function(index) {
		return null;
	}
	,__class__: h3d.shader.AmbientLight
});
h3d.shader.Base2d = function() {
	this.color__ = new h3d.Vector();
	this.absoluteMatrixB__ = new h3d.Vector();
	this.absoluteMatrixA__ = new h3d.Vector();
	this.zValue__ = 0;
	hxsl.Shader.call(this);
};
$hxClasses["h3d.shader.Base2d"] = h3d.shader.Base2d;
h3d.shader.Base2d.__name__ = true;
h3d.shader.Base2d.__super__ = hxsl.Shader;
h3d.shader.Base2d.prototype = $extend(hxsl.Shader.prototype,{
	set_isRelative: function(_v) {
		this.constModified = true;
		return this.isRelative__ = _v;
	}
	,updateConstants: function(globals) {
		this.constBits = 0;
		if(this.isRelative__) this.constBits |= 1;
		hxsl.Shader.prototype.updateConstants.call(this,globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.zValue__;
		case 1:
			return this.absoluteMatrixA__;
		case 2:
			return this.texture__;
		case 3:
			return this.isRelative__;
		case 4:
			return this.absoluteMatrixB__;
		case 5:
			return this.color__;
		default:
		}
		return null;
	}
	,__class__: h3d.shader.Base2d
	,__properties__: {set_isRelative:"set_isRelative"}
});
h3d.shader.BaseMesh = function() {
	this.color__ = new h3d.Vector();
	hxsl.Shader.call(this);
	this.color__.set(1,1,1,null);
};
$hxClasses["h3d.shader.BaseMesh"] = h3d.shader.BaseMesh;
h3d.shader.BaseMesh.__name__ = true;
h3d.shader.BaseMesh.__super__ = hxsl.Shader;
h3d.shader.BaseMesh.prototype = $extend(hxsl.Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		hxsl.Shader.prototype.updateConstants.call(this,globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.color__;
		default:
		}
		return null;
	}
	,__class__: h3d.shader.BaseMesh
});
h3d.shader.Blur = function() {
	this.values__ = new Array();
	this.pixel__ = new h3d.Vector();
	this.Quality__ = 0;
	hxsl.Shader.call(this);
};
$hxClasses["h3d.shader.Blur"] = h3d.shader.Blur;
h3d.shader.Blur.__name__ = true;
h3d.shader.Blur.__super__ = hxsl.Shader;
h3d.shader.Blur.prototype = $extend(hxsl.Shader.prototype,{
	set_Quality: function(_v) {
		this.constModified = true;
		return this.Quality__ = _v;
	}
	,set_isDepth: function(_v) {
		this.constModified = true;
		return this.isDepth__ = _v;
	}
	,updateConstants: function(globals) {
		this.constBits = 0;
		var v = this.Quality__;
		if(v >>> 8 != 0) throw "Quality" + " is out of range " + v + ">" + 255;
		this.constBits |= v;
		if(this.isDepth__) this.constBits |= 256;
		hxsl.Shader.prototype.updateConstants.call(this,globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.Quality__;
		case 1:
			return this.pixel__;
		case 2:
			return this.values__;
		case 3:
			return this.texture__;
		case 4:
			return this.isDepth__;
		default:
		}
		return null;
	}
	,__class__: h3d.shader.Blur
	,__properties__: {set_isDepth:"set_isDepth",set_Quality:"set_Quality"}
});
h3d.shader.ShaderBuffers = function(s) {
	var this1;
	this1 = new Array(s.globalsSize << 2);
	this.globals = this1;
	var this2;
	this2 = new Array(s.paramsSize << 2);
	this.params = this2;
	var this3;
	this3 = new Array(s.textures.length);
	this.tex = this3;
};
$hxClasses["h3d.shader.ShaderBuffers"] = h3d.shader.ShaderBuffers;
h3d.shader.ShaderBuffers.__name__ = true;
h3d.shader.ShaderBuffers.prototype = {
	__class__: h3d.shader.ShaderBuffers
};
h3d.shader.Buffers = function(s) {
	this.vertex = new h3d.shader.ShaderBuffers(s.vertex);
	this.fragment = new h3d.shader.ShaderBuffers(s.fragment);
};
$hxClasses["h3d.shader.Buffers"] = h3d.shader.Buffers;
h3d.shader.Buffers.__name__ = true;
h3d.shader.Buffers.prototype = {
	__class__: h3d.shader.Buffers
};
h3d.shader.Clear = function() {
	this.color__ = new h3d.Vector();
	this.depth__ = 0;
	hxsl.Shader.call(this);
};
$hxClasses["h3d.shader.Clear"] = h3d.shader.Clear;
h3d.shader.Clear.__name__ = true;
h3d.shader.Clear.__super__ = hxsl.Shader;
h3d.shader.Clear.prototype = $extend(hxsl.Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		hxsl.Shader.prototype.updateConstants.call(this,globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.depth__;
		case 1:
			return this.color__;
		default:
		}
		return null;
	}
	,__class__: h3d.shader.Clear
});
h3d.shader.ColorAdd = function() {
	this.color__ = new h3d.Vector();
};
$hxClasses["h3d.shader.ColorAdd"] = h3d.shader.ColorAdd;
h3d.shader.ColorAdd.__name__ = true;
h3d.shader.ColorAdd.__super__ = hxsl.Shader;
h3d.shader.ColorAdd.prototype = $extend(hxsl.Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		hxsl.Shader.prototype.updateConstants.call(this,globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.color__;
		default:
		}
		return null;
	}
	,__class__: h3d.shader.ColorAdd
});
h3d.shader.ColorKey = function() {
	this.colorKey__ = new h3d.Vector();
};
$hxClasses["h3d.shader.ColorKey"] = h3d.shader.ColorKey;
h3d.shader.ColorKey.__name__ = true;
h3d.shader.ColorKey.__super__ = hxsl.Shader;
h3d.shader.ColorKey.prototype = $extend(hxsl.Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		hxsl.Shader.prototype.updateConstants.call(this,globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.colorKey__;
		default:
		}
		return null;
	}
	,__class__: h3d.shader.ColorKey
});
h3d.shader.ColorMatrix = function() {
	this.matrix__ = new h3d.Matrix();
};
$hxClasses["h3d.shader.ColorMatrix"] = h3d.shader.ColorMatrix;
h3d.shader.ColorMatrix.__name__ = true;
h3d.shader.ColorMatrix.__super__ = hxsl.Shader;
h3d.shader.ColorMatrix.prototype = $extend(hxsl.Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		hxsl.Shader.prototype.updateConstants.call(this,globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.matrix__;
		default:
		}
		return null;
	}
	,__class__: h3d.shader.ColorMatrix
});
h3d.shader.DirLight = function() {
	this.direction__ = new h3d.Vector();
	this.color__ = new h3d.Vector();
};
$hxClasses["h3d.shader.DirLight"] = h3d.shader.DirLight;
h3d.shader.DirLight.__name__ = true;
h3d.shader.DirLight.__super__ = hxsl.Shader;
h3d.shader.DirLight.prototype = $extend(hxsl.Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		hxsl.Shader.prototype.updateConstants.call(this,globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.color__;
		case 1:
			return this.direction__;
		default:
		}
		return null;
	}
	,__class__: h3d.shader.DirLight
});
h3d.shader.Manager = function(output) {
	this.shaderCache = hxsl.Cache.get();
	this.globals = new hxsl.Globals();
	this.output = this.shaderCache.allocOutputVars(output);
};
$hxClasses["h3d.shader.Manager"] = h3d.shader.Manager;
h3d.shader.Manager.__name__ = true;
h3d.shader.Manager.prototype = {
	fillRec: function(v,type,out,pos) {
		switch(type[1]) {
		case 3:
			var val = v;
			out[pos] = val;
			return 1;
		case 5:
			var n = type[2];
			var v1 = v;
			var index = pos++;
			out[index] = v1.x;
			var index1 = pos++;
			out[index1] = v1.y;
			switch(n) {
			case 3:
				var index2 = pos++;
				out[index2] = v1.z;
				break;
			case 4:
				var index3 = pos++;
				out[index3] = v1.z;
				var index4 = pos++;
				out[index4] = v1.w;
				break;
			}
			return n;
		case 7:
			var m = v;
			var index5 = pos++;
			out[index5] = m._11;
			var index6 = pos++;
			out[index6] = m._21;
			var index7 = pos++;
			out[index7] = m._31;
			var index8 = pos++;
			out[index8] = m._41;
			var index9 = pos++;
			out[index9] = m._12;
			var index10 = pos++;
			out[index10] = m._22;
			var index11 = pos++;
			out[index11] = m._32;
			var index12 = pos++;
			out[index12] = m._42;
			var index13 = pos++;
			out[index13] = m._13;
			var index14 = pos++;
			out[index14] = m._23;
			var index15 = pos++;
			out[index15] = m._33;
			var index16 = pos++;
			out[index16] = m._43;
			var index17 = pos++;
			out[index17] = m._14;
			var index18 = pos++;
			out[index18] = m._24;
			var index19 = pos++;
			out[index19] = m._34;
			var index20 = pos++;
			out[index20] = m._44;
			return 16;
		case 8:
			var m1 = v;
			var index21 = pos++;
			out[index21] = m1._11;
			var index22 = pos++;
			out[index22] = m1._21;
			var index23 = pos++;
			out[index23] = m1._31;
			var index24 = pos++;
			out[index24] = m1._41;
			var index25 = pos++;
			out[index25] = m1._12;
			var index26 = pos++;
			out[index26] = m1._22;
			var index27 = pos++;
			out[index27] = m1._32;
			var index28 = pos++;
			out[index28] = m1._42;
			var index29 = pos++;
			out[index29] = m1._13;
			var index30 = pos++;
			out[index30] = m1._23;
			var index31 = pos++;
			out[index31] = m1._33;
			var index32 = pos++;
			out[index32] = m1._43;
			return 12;
		case 14:
			switch(type[3][1]) {
			case 0:
				var t = type[2];
				var len = type[3][2];
				var v2 = v;
				var size = 0;
				var _g = 0;
				while(_g < len) {
					var i = _g++;
					var n1 = v2[i];
					if(n1 == null) break;
					size = this.fillRec(n1,t,out,pos);
					pos += size;
				}
				return len * size;
			default:
				throw "assert " + Std.string(type);
			}
			break;
		case 12:
			var vl = type[2];
			var tot = 0;
			var _g1 = 0;
			while(_g1 < vl.length) {
				var vv = vl[_g1];
				++_g1;
				tot += this.fillRec(Reflect.field(v,vv.name),vv.type,out,pos + tot);
			}
			return tot;
		default:
			throw "assert " + Std.string(type);
		}
		return 0;
	}
	,getParamValue: function(p,shaders) {
		if(p.perObjectGlobal != null) {
			var v = this.globals.map.get(p.perObjectGlobal.gid);
			if(v == null) throw "Missing global value " + p.perObjectGlobal.path;
			return v;
		}
		var v1 = shaders[p.instance].getParamValue(p.index);
		if(v1 == null) throw "Missing param value " + Std.string(shaders[p.instance]) + "." + p.name;
		return v1;
	}
	,fillGlobals: function(buf,s) {
		var _g2 = this;
		var buf1 = buf.vertex;
		var s1 = s.vertex;
		var _g = 0;
		var _g1 = s1.globals;
		while(_g < _g1.length) {
			var g = _g1[_g];
			++_g;
			var v = _g2.globals.map.get(g.gid);
			if(v == null) {
				if(g.path == "__consts__") {
					_g2.fillRec(s1.consts,g.type,buf1.globals,g.pos);
					continue;
				}
				throw "Missing global value " + g.path;
			}
			_g2.fillRec(v,g.type,buf1.globals,g.pos);
		}
		var buf2 = buf.fragment;
		var s2 = s.fragment;
		var _g3 = 0;
		var _g11 = s2.globals;
		while(_g3 < _g11.length) {
			var g1 = _g11[_g3];
			++_g3;
			var v1 = _g2.globals.map.get(g1.gid);
			if(v1 == null) {
				if(g1.path == "__consts__") {
					_g2.fillRec(s2.consts,g1.type,buf2.globals,g1.pos);
					continue;
				}
				throw "Missing global value " + g1.path;
			}
			_g2.fillRec(v1,g1.type,buf2.globals,g1.pos);
		}
	}
	,fillParams: function(buf,s,shaders) {
		var _g2 = this;
		var buf1 = buf.vertex;
		var s1 = s.vertex;
		var _g = 0;
		var _g1 = s1.params;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			var v = _g2.getParamValue(p,shaders);
			_g2.fillRec(v,p.type,buf1.params,p.pos);
		}
		var tid = 0;
		var _g3 = 0;
		var _g11 = s1.textures;
		while(_g3 < _g11.length) {
			var p1 = _g11[_g3];
			++_g3;
			var t = _g2.getParamValue(p1,shaders);
			if(t == null) t = h3d.mat.Texture.fromColor(-65281);
			var index = tid++;
			buf1.tex[index] = t;
		}
		var buf2 = buf.fragment;
		var s2 = s.fragment;
		var _g4 = 0;
		var _g12 = s2.params;
		while(_g4 < _g12.length) {
			var p2 = _g12[_g4];
			++_g4;
			var v1 = _g2.getParamValue(p2,shaders);
			_g2.fillRec(v1,p2.type,buf2.params,p2.pos);
		}
		var tid1 = 0;
		var _g5 = 0;
		var _g13 = s2.textures;
		while(_g5 < _g13.length) {
			var p3 = _g13[_g5];
			++_g5;
			var t1 = _g2.getParamValue(p3,shaders);
			if(t1 == null) t1 = h3d.mat.Texture.fromColor(-65281);
			var index1 = tid1++;
			buf2.tex[index1] = t1;
		}
	}
	,compileShaders: function(shaders) {
		var instances;
		var _g = [];
		var _g1 = 0;
		while(_g1 < shaders.length) {
			var s = shaders[_g1];
			++_g1;
			if(s != null) _g.push((function($this) {
				var $r;
				s.updateConstants($this.globals);
				$r = s.instance;
				return $r;
			}(this)));
		}
		instances = _g;
		return this.shaderCache.link(instances,this.output);
	}
	,compileInstances: function(instances) {
		return this.shaderCache.link(instances,this.output);
	}
	,__class__: h3d.shader.Manager
};
h3d.shader.PointLight = function() {
	this.params__ = new h3d.Vector();
	this.color__ = new h3d.Vector();
	this.lightPosition__ = new h3d.Vector();
};
$hxClasses["h3d.shader.PointLight"] = h3d.shader.PointLight;
h3d.shader.PointLight.__name__ = true;
h3d.shader.PointLight.__super__ = hxsl.Shader;
h3d.shader.PointLight.prototype = $extend(hxsl.Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		hxsl.Shader.prototype.updateConstants.call(this,globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.lightPosition__;
		case 1:
			return this.color__;
		case 2:
			return this.params__;
		default:
		}
		return null;
	}
	,__class__: h3d.shader.PointLight
});
h3d.shader.Skin = function() {
	this.MaxBones__ = 0;
	this.bonesMatrixes__ = new Array();
};
$hxClasses["h3d.shader.Skin"] = h3d.shader.Skin;
h3d.shader.Skin.__name__ = true;
h3d.shader.Skin.__super__ = hxsl.Shader;
h3d.shader.Skin.prototype = $extend(hxsl.Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		var v = this.MaxBones__;
		if(v >>> 8 != 0) throw "MaxBones" + " is out of range " + v + ">" + 255;
		this.constBits |= v;
		hxsl.Shader.prototype.updateConstants.call(this,globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.bonesMatrixes__;
		case 1:
			return this.MaxBones__;
		default:
		}
		return null;
	}
	,__class__: h3d.shader.Skin
});
h3d.shader.Texture = function(tex) {
	this.killAlphaThreshold__ = 0;
	hxsl.Shader.call(this);
	this.texture__ = tex;
	this.killAlphaThreshold__ = 0.5;
};
$hxClasses["h3d.shader.Texture"] = h3d.shader.Texture;
h3d.shader.Texture.__name__ = true;
h3d.shader.Texture.__super__ = hxsl.Shader;
h3d.shader.Texture.prototype = $extend(hxsl.Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		if(this.additive__) this.constBits |= 1;
		if(this.killAlpha__) this.constBits |= 2;
		hxsl.Shader.prototype.updateConstants.call(this,globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.additive__;
		case 1:
			return this.texture__;
		case 2:
			return this.killAlphaThreshold__;
		case 3:
			return this.killAlpha__;
		default:
		}
		return null;
	}
	,__class__: h3d.shader.Texture
});
h3d.shader.Texture2 = function() {
	this.killAlphaThreshold__ = 0;
};
$hxClasses["h3d.shader.Texture2"] = h3d.shader.Texture2;
h3d.shader.Texture2.__name__ = true;
h3d.shader.Texture2.__super__ = hxsl.Shader;
h3d.shader.Texture2.prototype = $extend(hxsl.Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		if(this.additive__) this.constBits |= 1;
		if(this.killAlpha__) this.constBits |= 2;
		hxsl.Shader.prototype.updateConstants.call(this,globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.additive__;
		case 1:
			return this.texture__;
		case 2:
			return this.killAlphaThreshold__;
		case 3:
			return this.killAlpha__;
		default:
		}
		return null;
	}
	,__class__: h3d.shader.Texture2
});
h3d.shader.UVScroll = function() {
	this.uvDelta__ = new h3d.Vector();
};
$hxClasses["h3d.shader.UVScroll"] = h3d.shader.UVScroll;
h3d.shader.UVScroll.__name__ = true;
h3d.shader.UVScroll.__super__ = hxsl.Shader;
h3d.shader.UVScroll.prototype = $extend(hxsl.Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		hxsl.Shader.prototype.updateConstants.call(this,globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.uvDelta__;
		default:
		}
		return null;
	}
	,__class__: h3d.shader.UVScroll
});
h3d.shader.VertexColor = function() { };
$hxClasses["h3d.shader.VertexColor"] = h3d.shader.VertexColor;
h3d.shader.VertexColor.__name__ = true;
h3d.shader.VertexColor.__super__ = hxsl.Shader;
h3d.shader.VertexColor.prototype = $extend(hxsl.Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		if(this.additive__) this.constBits |= 1;
		hxsl.Shader.prototype.updateConstants.call(this,globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.additive__;
		default:
		}
		return null;
	}
	,__class__: h3d.shader.VertexColor
});
h3d.shader.VertexColorAlpha = function() { };
$hxClasses["h3d.shader.VertexColorAlpha"] = h3d.shader.VertexColorAlpha;
h3d.shader.VertexColorAlpha.__name__ = true;
h3d.shader.VertexColorAlpha.__super__ = hxsl.Shader;
h3d.shader.VertexColorAlpha.prototype = $extend(hxsl.Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		if(this.additive__) this.constBits |= 1;
		hxsl.Shader.prototype.updateConstants.call(this,globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.additive__;
		default:
		}
		return null;
	}
	,__class__: h3d.shader.VertexColorAlpha
});
haxe.Resource = function() { };
$hxClasses["haxe.Resource"] = haxe.Resource;
haxe.Resource.__name__ = true;
haxe.Resource.getBytes = function(name) {
	var _g = 0;
	var _g1 = haxe.Resource.content;
	while(_g < _g1.length) {
		var x = _g1[_g];
		++_g;
		if(x.name == name) {
			if(x.str != null) return haxe.io.Bytes.ofString(x.str);
			return haxe.crypto.Base64.decode(x.data);
		}
	}
	return null;
};
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
$hxClasses["haxe.Timer"] = haxe.Timer;
haxe.Timer.__name__ = true;
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe.Timer.stamp = function() {
	return new Date().getTime() / 1000;
};
haxe.Timer.prototype = {
	stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
	,__class__: haxe.Timer
};
haxe.io = {};
haxe.io.Bytes = function(length,b) {
	this.length = length;
	this.b = b;
};
$hxClasses["haxe.io.Bytes"] = haxe.io.Bytes;
haxe.io.Bytes.__name__ = true;
haxe.io.Bytes.alloc = function(length) {
	var a = new Array();
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		a.push(0);
	}
	return new haxe.io.Bytes(length,a);
};
haxe.io.Bytes.ofString = function(s) {
	var a = new Array();
	var i = 0;
	while(i < s.length) {
		var c = StringTools.fastCodeAt(s,i++);
		if(55296 <= c && c <= 56319) c = c - 55232 << 10 | StringTools.fastCodeAt(s,i++) & 1023;
		if(c <= 127) a.push(c); else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe.io.Bytes(a.length,a);
};
haxe.io.Bytes.ofData = function(b) {
	return new haxe.io.Bytes(b.length,b);
};
haxe.io.Bytes.prototype = {
	get: function(pos) {
		return this.b[pos];
	}
	,set: function(pos,v) {
		this.b[pos] = v & 255;
	}
	,blit: function(pos,src,srcpos,len) {
		if(pos < 0 || srcpos < 0 || len < 0 || pos + len > this.length || srcpos + len > src.length) throw haxe.io.Error.OutsideBounds;
		var b1 = this.b;
		var b2 = src.b;
		if(b1 == b2 && pos > srcpos) {
			var i = len;
			while(i > 0) {
				i--;
				b1[i + pos] = b2[i + srcpos];
			}
			return;
		}
		var _g = 0;
		while(_g < len) {
			var i1 = _g++;
			b1[i1 + pos] = b2[i1 + srcpos];
		}
	}
	,getString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) break;
				s += fcc(c);
			} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
				var c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				var c21 = b[i++];
				var c3 = b[i++];
				var u = (c & 15) << 18 | (c21 & 127) << 12 | (c3 & 127) << 6 | b[i++] & 127;
				s += fcc((u >> 10) + 55232);
				s += fcc(u & 1023 | 56320);
			}
		}
		return s;
	}
	,toString: function() {
		return this.getString(0,this.length);
	}
	,__class__: haxe.io.Bytes
};
haxe.crypto = {};
haxe.crypto.Base64 = function() { };
$hxClasses["haxe.crypto.Base64"] = haxe.crypto.Base64;
haxe.crypto.Base64.__name__ = true;
haxe.crypto.Base64.decode = function(str,complement) {
	if(complement == null) complement = true;
	if(complement) while(HxOverrides.cca(str,str.length - 1) == 61) str = HxOverrides.substr(str,0,-1);
	return new haxe.crypto.BaseCode(haxe.crypto.Base64.BYTES).decodeBytes(haxe.io.Bytes.ofString(str));
};
haxe.crypto.BaseCode = function(base) {
	var len = base.length;
	var nbits = 1;
	while(len > 1 << nbits) nbits++;
	if(nbits > 8 || len != 1 << nbits) throw "BaseCode : base length must be a power of two.";
	this.base = base;
	this.nbits = nbits;
};
$hxClasses["haxe.crypto.BaseCode"] = haxe.crypto.BaseCode;
haxe.crypto.BaseCode.__name__ = true;
haxe.crypto.BaseCode.prototype = {
	initTable: function() {
		var tbl = new Array();
		var _g = 0;
		while(_g < 256) {
			var i = _g++;
			tbl[i] = -1;
		}
		var _g1 = 0;
		var _g2 = this.base.length;
		while(_g1 < _g2) {
			var i1 = _g1++;
			tbl[this.base.b[i1]] = i1;
		}
		this.tbl = tbl;
	}
	,decodeBytes: function(b) {
		var nbits = this.nbits;
		var base = this.base;
		if(this.tbl == null) this.initTable();
		var tbl = this.tbl;
		var size = b.length * nbits >> 3;
		var out = haxe.io.Bytes.alloc(size);
		var buf = 0;
		var curbits = 0;
		var pin = 0;
		var pout = 0;
		while(pout < size) {
			while(curbits < 8) {
				curbits += nbits;
				buf <<= nbits;
				var i = tbl[b.get(pin++)];
				if(i == -1) throw "BaseCode : invalid encoded char";
				buf |= i;
			}
			curbits -= 8;
			out.set(pout++,buf >> curbits & 255);
		}
		return out;
	}
	,__class__: haxe.crypto.BaseCode
};
haxe.crypto.Crc32 = function() {
	this.crc = -1;
};
$hxClasses["haxe.crypto.Crc32"] = haxe.crypto.Crc32;
haxe.crypto.Crc32.__name__ = true;
haxe.crypto.Crc32.prototype = {
	'byte': function(b) {
		var tmp = (this.crc ^ b) & 255;
		var _g = 0;
		while(_g < 8) {
			var j = _g++;
			if((tmp & 1) == 1) tmp = tmp >>> 1 ^ -306674912; else tmp >>>= 1;
		}
		this.crc = this.crc >>> 8 ^ tmp;
	}
	,update: function(b,pos,len) {
		var b1 = b.b;
		var _g1 = pos;
		var _g = pos + len;
		while(_g1 < _g) {
			var i = _g1++;
			var tmp = (this.crc ^ b1[i]) & 255;
			var _g2 = 0;
			while(_g2 < 8) {
				var j = _g2++;
				if((tmp & 1) == 1) tmp = tmp >>> 1 ^ -306674912; else tmp >>>= 1;
			}
			this.crc = this.crc >>> 8 ^ tmp;
		}
	}
	,get: function() {
		return this.crc ^ -1;
	}
	,__class__: haxe.crypto.Crc32
};
haxe.ds = {};
haxe.ds.BalancedTree = function() {
};
$hxClasses["haxe.ds.BalancedTree"] = haxe.ds.BalancedTree;
haxe.ds.BalancedTree.__name__ = true;
haxe.ds.BalancedTree.prototype = {
	set: function(key,value) {
		this.root = this.setLoop(key,value,this.root);
	}
	,get: function(key) {
		var node = this.root;
		while(node != null) {
			var c = this.compare(key,node.key);
			if(c == 0) return node.value;
			if(c < 0) node = node.left; else node = node.right;
		}
		return null;
	}
	,iterator: function() {
		var ret = [];
		this.iteratorLoop(this.root,ret);
		return HxOverrides.iter(ret);
	}
	,setLoop: function(k,v,node) {
		if(node == null) return new haxe.ds.TreeNode(null,k,v,null);
		var c = this.compare(k,node.key);
		if(c == 0) return new haxe.ds.TreeNode(node.left,k,v,node.right,node == null?0:node._height); else if(c < 0) {
			var nl = this.setLoop(k,v,node.left);
			return this.balance(nl,node.key,node.value,node.right);
		} else {
			var nr = this.setLoop(k,v,node.right);
			return this.balance(node.left,node.key,node.value,nr);
		}
	}
	,iteratorLoop: function(node,acc) {
		if(node != null) {
			this.iteratorLoop(node.left,acc);
			acc.push(node.value);
			this.iteratorLoop(node.right,acc);
		}
	}
	,balance: function(l,k,v,r) {
		var hl;
		if(l == null) hl = 0; else hl = l._height;
		var hr;
		if(r == null) hr = 0; else hr = r._height;
		if(hl > hr + 2) {
			if((function($this) {
				var $r;
				var _this = l.left;
				$r = _this == null?0:_this._height;
				return $r;
			}(this)) >= (function($this) {
				var $r;
				var _this1 = l.right;
				$r = _this1 == null?0:_this1._height;
				return $r;
			}(this))) return new haxe.ds.TreeNode(l.left,l.key,l.value,new haxe.ds.TreeNode(l.right,k,v,r)); else return new haxe.ds.TreeNode(new haxe.ds.TreeNode(l.left,l.key,l.value,l.right.left),l.right.key,l.right.value,new haxe.ds.TreeNode(l.right.right,k,v,r));
		} else if(hr > hl + 2) {
			if((function($this) {
				var $r;
				var _this2 = r.right;
				$r = _this2 == null?0:_this2._height;
				return $r;
			}(this)) > (function($this) {
				var $r;
				var _this3 = r.left;
				$r = _this3 == null?0:_this3._height;
				return $r;
			}(this))) return new haxe.ds.TreeNode(new haxe.ds.TreeNode(l,k,v,r.left),r.key,r.value,r.right); else return new haxe.ds.TreeNode(new haxe.ds.TreeNode(l,k,v,r.left.left),r.left.key,r.left.value,new haxe.ds.TreeNode(r.left.right,r.key,r.value,r.right));
		} else return new haxe.ds.TreeNode(l,k,v,r,(hl > hr?hl:hr) + 1);
	}
	,compare: function(k1,k2) {
		return Reflect.compare(k1,k2);
	}
	,__class__: haxe.ds.BalancedTree
};
haxe.ds.TreeNode = function(l,k,v,r,h) {
	if(h == null) h = -1;
	this.left = l;
	this.key = k;
	this.value = v;
	this.right = r;
	if(h == -1) this._height = ((function($this) {
		var $r;
		var _this = $this.left;
		$r = _this == null?0:_this._height;
		return $r;
	}(this)) > (function($this) {
		var $r;
		var _this1 = $this.right;
		$r = _this1 == null?0:_this1._height;
		return $r;
	}(this))?(function($this) {
		var $r;
		var _this2 = $this.left;
		$r = _this2 == null?0:_this2._height;
		return $r;
	}(this)):(function($this) {
		var $r;
		var _this3 = $this.right;
		$r = _this3 == null?0:_this3._height;
		return $r;
	}(this))) + 1; else this._height = h;
};
$hxClasses["haxe.ds.TreeNode"] = haxe.ds.TreeNode;
haxe.ds.TreeNode.__name__ = true;
haxe.ds.TreeNode.prototype = {
	__class__: haxe.ds.TreeNode
};
haxe.ds.EnumValueMap = function() {
	haxe.ds.BalancedTree.call(this);
};
$hxClasses["haxe.ds.EnumValueMap"] = haxe.ds.EnumValueMap;
haxe.ds.EnumValueMap.__name__ = true;
haxe.ds.EnumValueMap.__interfaces__ = [IMap];
haxe.ds.EnumValueMap.__super__ = haxe.ds.BalancedTree;
haxe.ds.EnumValueMap.prototype = $extend(haxe.ds.BalancedTree.prototype,{
	compare: function(k1,k2) {
		var d = k1[1] - k2[1];
		if(d != 0) return d;
		var p1 = k1.slice(2);
		var p2 = k2.slice(2);
		if(p1.length == 0 && p2.length == 0) return 0;
		return this.compareArgs(p1,p2);
	}
	,compareArgs: function(a1,a2) {
		var ld = a1.length - a2.length;
		if(ld != 0) return ld;
		var _g1 = 0;
		var _g = a1.length;
		while(_g1 < _g) {
			var i = _g1++;
			var d = this.compareArg(a1[i],a2[i]);
			if(d != 0) return d;
		}
		return 0;
	}
	,compareArg: function(v1,v2) {
		if(Reflect.isEnumValue(v1) && Reflect.isEnumValue(v2)) return this.compare(v1,v2); else if((v1 instanceof Array) && v1.__enum__ == null && ((v2 instanceof Array) && v2.__enum__ == null)) return this.compareArgs(v1,v2); else return Reflect.compare(v1,v2);
	}
	,__class__: haxe.ds.EnumValueMap
});
haxe.ds.IntMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.IntMap"] = haxe.ds.IntMap;
haxe.ds.IntMap.__name__ = true;
haxe.ds.IntMap.__interfaces__ = [IMap];
haxe.ds.IntMap.prototype = {
	set: function(key,value) {
		this.h[key] = value;
	}
	,get: function(key) {
		return this.h[key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,remove: function(key) {
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i];
		}};
	}
	,__class__: haxe.ds.IntMap
};
haxe.ds.ListSort = function() { };
$hxClasses["haxe.ds.ListSort"] = haxe.ds.ListSort;
haxe.ds.ListSort.__name__ = true;
haxe.ds.ListSort.sortSingleLinked = function(list,cmp) {
	if(list == null) return null;
	var insize = 1;
	var nmerges;
	var psize = 0;
	var qsize = 0;
	var p;
	var q;
	var e;
	var tail;
	while(true) {
		p = list;
		list = null;
		tail = null;
		nmerges = 0;
		while(p != null) {
			nmerges++;
			q = p;
			psize = 0;
			var _g = 0;
			while(_g < insize) {
				var i = _g++;
				psize++;
				q = q.next;
				if(q == null) break;
			}
			qsize = insize;
			while(psize > 0 || qsize > 0 && q != null) {
				if(psize == 0) {
					e = q;
					q = q.next;
					qsize--;
				} else if(qsize == 0 || q == null || cmp(p,q) <= 0) {
					e = p;
					p = p.next;
					psize--;
				} else {
					e = q;
					q = q.next;
					qsize--;
				}
				if(tail != null) tail.next = e; else list = e;
				tail = e;
			}
			p = q;
		}
		tail.next = null;
		if(nmerges <= 1) break;
		insize *= 2;
	}
	return list;
};
haxe.ds.ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
$hxClasses["haxe.ds.ObjectMap"] = haxe.ds.ObjectMap;
haxe.ds.ObjectMap.__name__ = true;
haxe.ds.ObjectMap.__interfaces__ = [IMap];
haxe.ds.ObjectMap.prototype = {
	set: function(key,value) {
		var id = key.__id__ || (key.__id__ = ++haxe.ds.ObjectMap.count);
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,get: function(key) {
		return this.h[key.__id__];
	}
	,exists: function(key) {
		return this.h.__keys__[key.__id__] != null;
	}
	,remove: function(key) {
		var id = key.__id__;
		if(this.h.__keys__[id] == null) return false;
		delete(this.h[id]);
		delete(this.h.__keys__[id]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h.__keys__ ) {
		if(this.h.hasOwnProperty(key)) a.push(this.h.__keys__[key]);
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe.ds.ObjectMap
};
haxe.ds.StringMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.StringMap"] = haxe.ds.StringMap;
haxe.ds.StringMap.__name__ = true;
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe.ds.StringMap
};
haxe.io.BytesBuffer = function() {
	this.b = new Array();
};
$hxClasses["haxe.io.BytesBuffer"] = haxe.io.BytesBuffer;
haxe.io.BytesBuffer.__name__ = true;
haxe.io.BytesBuffer.prototype = {
	add: function(src) {
		var b1 = this.b;
		var b2 = src.b;
		var _g1 = 0;
		var _g = src.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.b.push(b2[i]);
		}
	}
	,addBytes: function(src,pos,len) {
		if(pos < 0 || len < 0 || pos + len > src.length) throw haxe.io.Error.OutsideBounds;
		var b1 = this.b;
		var b2 = src.b;
		var _g1 = pos;
		var _g = pos + len;
		while(_g1 < _g) {
			var i = _g1++;
			this.b.push(b2[i]);
		}
	}
	,getBytes: function() {
		var bytes = new haxe.io.Bytes(this.b.length,this.b);
		this.b = null;
		return bytes;
	}
	,__class__: haxe.io.BytesBuffer
};
haxe.io.Input = function() { };
$hxClasses["haxe.io.Input"] = haxe.io.Input;
haxe.io.Input.__name__ = true;
haxe.io.Input.prototype = {
	readByte: function() {
		throw "Not implemented";
	}
	,readBytes: function(s,pos,len) {
		var k = len;
		var b = s.b;
		if(pos < 0 || len < 0 || pos + len > s.length) throw haxe.io.Error.OutsideBounds;
		while(k > 0) {
			b[pos] = this.readByte();
			pos++;
			k--;
		}
		return len;
	}
	,close: function() {
	}
	,set_bigEndian: function(b) {
		this.bigEndian = b;
		return b;
	}
	,readFullBytes: function(s,pos,len) {
		while(len > 0) {
			var k = this.readBytes(s,pos,len);
			pos += k;
			len -= k;
		}
	}
	,read: function(nbytes) {
		var s = haxe.io.Bytes.alloc(nbytes);
		var p = 0;
		while(nbytes > 0) {
			var k = this.readBytes(s,p,nbytes);
			if(k == 0) throw haxe.io.Error.Blocked;
			p += k;
			nbytes -= k;
		}
		return s;
	}
	,readDouble: function() {
		var bytes = [];
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		if(!this.bigEndian) bytes.reverse();
		var sign = 1 - (bytes[0] >> 7 << 1);
		var exp = (bytes[0] << 4 & 2047 | bytes[1] >> 4) - 1023;
		var sig = this.getDoubleSig(bytes);
		if(sig == 0 && exp == -1023) return 0.0;
		return sign * (1.0 + Math.pow(2,-52) * sig) * Math.pow(2,exp);
	}
	,readUInt16: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		if(this.bigEndian) return ch2 | ch1 << 8; else return ch1 | ch2 << 8;
	}
	,readInt24: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		var n;
		if(this.bigEndian) n = ch3 | ch2 << 8 | ch1 << 16; else n = ch1 | ch2 << 8 | ch3 << 16;
		if((n & 8388608) != 0) return n - 16777216;
		return n;
	}
	,readUInt24: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		if(this.bigEndian) return ch3 | ch2 << 8 | ch1 << 16; else return ch1 | ch2 << 8 | ch3 << 16;
	}
	,readInt32: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		var ch4 = this.readByte();
		if(this.bigEndian) return ch4 | ch3 << 8 | ch2 << 16 | ch1 << 24; else return ch1 | ch2 << 8 | ch3 << 16 | ch4 << 24;
	}
	,readString: function(len) {
		var b = haxe.io.Bytes.alloc(len);
		this.readFullBytes(b,0,len);
		return b.toString();
	}
	,getDoubleSig: function(bytes) {
		return ((bytes[1] & 15) << 16 | bytes[2] << 8 | bytes[3]) * 4294967296. + (bytes[4] >> 7) * 2147483648 + ((bytes[4] & 127) << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7]);
	}
	,__class__: haxe.io.Input
	,__properties__: {set_bigEndian:"set_bigEndian"}
};
haxe.io.BytesInput = function(b,pos,len) {
	if(pos == null) pos = 0;
	if(len == null) len = b.length - pos;
	if(pos < 0 || len < 0 || pos + len > b.length) throw haxe.io.Error.OutsideBounds;
	this.b = b.b;
	this.pos = pos;
	this.len = len;
	this.totlen = len;
};
$hxClasses["haxe.io.BytesInput"] = haxe.io.BytesInput;
haxe.io.BytesInput.__name__ = true;
haxe.io.BytesInput.__super__ = haxe.io.Input;
haxe.io.BytesInput.prototype = $extend(haxe.io.Input.prototype,{
	readByte: function() {
		if(this.len == 0) throw new haxe.io.Eof();
		this.len--;
		return this.b[this.pos++];
	}
	,readBytes: function(buf,pos,len) {
		if(pos < 0 || len < 0 || pos + len > buf.length) throw haxe.io.Error.OutsideBounds;
		if(this.len == 0 && len > 0) throw new haxe.io.Eof();
		if(this.len < len) len = this.len;
		var b1 = this.b;
		var b2 = buf.b;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			b2[pos + i] = b1[this.pos + i];
		}
		this.pos += len;
		this.len -= len;
		return len;
	}
	,__class__: haxe.io.BytesInput
});
haxe.io.Output = function() { };
$hxClasses["haxe.io.Output"] = haxe.io.Output;
haxe.io.Output.__name__ = true;
haxe.io.Output.prototype = {
	writeByte: function(c) {
		throw "Not implemented";
	}
	,writeFloat: function(x) {
		if(x == 0.0) {
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			return;
		}
		var exp = Math.floor(Math.log(Math.abs(x)) / haxe.io.Output.LN2);
		var sig = Math.floor(Math.abs(x) / Math.pow(2,exp) * 8388608) & 8388607;
		var b4;
		b4 = exp + 127 >> 1 | (exp > 0?x < 0?128:64:x < 0?128:0);
		var b3 = exp + 127 << 7 & 255 | sig >> 16 & 127;
		var b2 = sig >> 8 & 255;
		var b1 = sig & 255;
		if(this.bigEndian) {
			this.writeByte(b4);
			this.writeByte(b3);
			this.writeByte(b2);
			this.writeByte(b1);
		} else {
			this.writeByte(b1);
			this.writeByte(b2);
			this.writeByte(b3);
			this.writeByte(b4);
		}
	}
	,writeInt32: function(x) {
		if(this.bigEndian) {
			this.writeByte(x >>> 24);
			this.writeByte(x >> 16 & 255);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x & 255);
		} else {
			this.writeByte(x & 255);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x >> 16 & 255);
			this.writeByte(x >>> 24);
		}
	}
	,__class__: haxe.io.Output
};
haxe.io.BytesOutput = function() {
	this.b = new haxe.io.BytesBuffer();
};
$hxClasses["haxe.io.BytesOutput"] = haxe.io.BytesOutput;
haxe.io.BytesOutput.__name__ = true;
haxe.io.BytesOutput.__super__ = haxe.io.Output;
haxe.io.BytesOutput.prototype = $extend(haxe.io.Output.prototype,{
	writeByte: function(c) {
		this.b.b.push(c);
	}
	,getBytes: function() {
		return this.b.getBytes();
	}
	,__class__: haxe.io.BytesOutput
});
haxe.io.Eof = function() {
};
$hxClasses["haxe.io.Eof"] = haxe.io.Eof;
haxe.io.Eof.__name__ = true;
haxe.io.Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe.io.Eof
};
haxe.io.Error = $hxClasses["haxe.io.Error"] = { __ename__ : true, __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.toString = $estr;
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.toString = $estr;
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.toString = $estr;
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; $x.toString = $estr; return $x; };
haxe.io.Error.__empty_constructs__ = [haxe.io.Error.Blocked,haxe.io.Error.Overflow,haxe.io.Error.OutsideBounds];
haxe.macro = {};
haxe.macro.Binop = $hxClasses["haxe.macro.Binop"] = { __ename__ : true, __constructs__ : ["OpAdd","OpMult","OpDiv","OpSub","OpAssign","OpEq","OpNotEq","OpGt","OpGte","OpLt","OpLte","OpAnd","OpOr","OpXor","OpBoolAnd","OpBoolOr","OpShl","OpShr","OpUShr","OpMod","OpAssignOp","OpInterval","OpArrow"] };
haxe.macro.Binop.OpAdd = ["OpAdd",0];
haxe.macro.Binop.OpAdd.toString = $estr;
haxe.macro.Binop.OpAdd.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpMult = ["OpMult",1];
haxe.macro.Binop.OpMult.toString = $estr;
haxe.macro.Binop.OpMult.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpDiv = ["OpDiv",2];
haxe.macro.Binop.OpDiv.toString = $estr;
haxe.macro.Binop.OpDiv.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpSub = ["OpSub",3];
haxe.macro.Binop.OpSub.toString = $estr;
haxe.macro.Binop.OpSub.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpAssign = ["OpAssign",4];
haxe.macro.Binop.OpAssign.toString = $estr;
haxe.macro.Binop.OpAssign.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpEq = ["OpEq",5];
haxe.macro.Binop.OpEq.toString = $estr;
haxe.macro.Binop.OpEq.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpNotEq = ["OpNotEq",6];
haxe.macro.Binop.OpNotEq.toString = $estr;
haxe.macro.Binop.OpNotEq.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpGt = ["OpGt",7];
haxe.macro.Binop.OpGt.toString = $estr;
haxe.macro.Binop.OpGt.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpGte = ["OpGte",8];
haxe.macro.Binop.OpGte.toString = $estr;
haxe.macro.Binop.OpGte.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpLt = ["OpLt",9];
haxe.macro.Binop.OpLt.toString = $estr;
haxe.macro.Binop.OpLt.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpLte = ["OpLte",10];
haxe.macro.Binop.OpLte.toString = $estr;
haxe.macro.Binop.OpLte.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpAnd = ["OpAnd",11];
haxe.macro.Binop.OpAnd.toString = $estr;
haxe.macro.Binop.OpAnd.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpOr = ["OpOr",12];
haxe.macro.Binop.OpOr.toString = $estr;
haxe.macro.Binop.OpOr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpXor = ["OpXor",13];
haxe.macro.Binop.OpXor.toString = $estr;
haxe.macro.Binop.OpXor.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpBoolAnd = ["OpBoolAnd",14];
haxe.macro.Binop.OpBoolAnd.toString = $estr;
haxe.macro.Binop.OpBoolAnd.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpBoolOr = ["OpBoolOr",15];
haxe.macro.Binop.OpBoolOr.toString = $estr;
haxe.macro.Binop.OpBoolOr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpShl = ["OpShl",16];
haxe.macro.Binop.OpShl.toString = $estr;
haxe.macro.Binop.OpShl.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpShr = ["OpShr",17];
haxe.macro.Binop.OpShr.toString = $estr;
haxe.macro.Binop.OpShr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpUShr = ["OpUShr",18];
haxe.macro.Binop.OpUShr.toString = $estr;
haxe.macro.Binop.OpUShr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpMod = ["OpMod",19];
haxe.macro.Binop.OpMod.toString = $estr;
haxe.macro.Binop.OpMod.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpAssignOp = function(op) { var $x = ["OpAssignOp",20,op]; $x.__enum__ = haxe.macro.Binop; $x.toString = $estr; return $x; };
haxe.macro.Binop.OpInterval = ["OpInterval",21];
haxe.macro.Binop.OpInterval.toString = $estr;
haxe.macro.Binop.OpInterval.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpArrow = ["OpArrow",22];
haxe.macro.Binop.OpArrow.toString = $estr;
haxe.macro.Binop.OpArrow.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.__empty_constructs__ = [haxe.macro.Binop.OpAdd,haxe.macro.Binop.OpMult,haxe.macro.Binop.OpDiv,haxe.macro.Binop.OpSub,haxe.macro.Binop.OpAssign,haxe.macro.Binop.OpEq,haxe.macro.Binop.OpNotEq,haxe.macro.Binop.OpGt,haxe.macro.Binop.OpGte,haxe.macro.Binop.OpLt,haxe.macro.Binop.OpLte,haxe.macro.Binop.OpAnd,haxe.macro.Binop.OpOr,haxe.macro.Binop.OpXor,haxe.macro.Binop.OpBoolAnd,haxe.macro.Binop.OpBoolOr,haxe.macro.Binop.OpShl,haxe.macro.Binop.OpShr,haxe.macro.Binop.OpUShr,haxe.macro.Binop.OpMod,haxe.macro.Binop.OpInterval,haxe.macro.Binop.OpArrow];
haxe.macro.Unop = $hxClasses["haxe.macro.Unop"] = { __ename__ : true, __constructs__ : ["OpIncrement","OpDecrement","OpNot","OpNeg","OpNegBits"] };
haxe.macro.Unop.OpIncrement = ["OpIncrement",0];
haxe.macro.Unop.OpIncrement.toString = $estr;
haxe.macro.Unop.OpIncrement.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpDecrement = ["OpDecrement",1];
haxe.macro.Unop.OpDecrement.toString = $estr;
haxe.macro.Unop.OpDecrement.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpNot = ["OpNot",2];
haxe.macro.Unop.OpNot.toString = $estr;
haxe.macro.Unop.OpNot.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpNeg = ["OpNeg",3];
haxe.macro.Unop.OpNeg.toString = $estr;
haxe.macro.Unop.OpNeg.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpNegBits = ["OpNegBits",4];
haxe.macro.Unop.OpNegBits.toString = $estr;
haxe.macro.Unop.OpNegBits.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.__empty_constructs__ = [haxe.macro.Unop.OpIncrement,haxe.macro.Unop.OpDecrement,haxe.macro.Unop.OpNot,haxe.macro.Unop.OpNeg,haxe.macro.Unop.OpNegBits];
haxe.xml = {};
haxe.xml._Fast = {};
haxe.xml._Fast.NodeAccess = function(x) {
	this.__x = x;
};
$hxClasses["haxe.xml._Fast.NodeAccess"] = haxe.xml._Fast.NodeAccess;
haxe.xml._Fast.NodeAccess.__name__ = true;
haxe.xml._Fast.NodeAccess.prototype = {
	__class__: haxe.xml._Fast.NodeAccess
};
haxe.xml._Fast.AttribAccess = function(x) {
	this.__x = x;
};
$hxClasses["haxe.xml._Fast.AttribAccess"] = haxe.xml._Fast.AttribAccess;
haxe.xml._Fast.AttribAccess.__name__ = true;
haxe.xml._Fast.AttribAccess.prototype = {
	resolve: function(name) {
		if(this.__x.nodeType == Xml.Document) throw "Cannot access document attribute " + name;
		var v = this.__x.get(name);
		if(v == null) throw this.__x.get_nodeName() + " is missing attribute " + name;
		return v;
	}
	,__class__: haxe.xml._Fast.AttribAccess
};
haxe.xml._Fast.HasAttribAccess = function(x) {
	this.__x = x;
};
$hxClasses["haxe.xml._Fast.HasAttribAccess"] = haxe.xml._Fast.HasAttribAccess;
haxe.xml._Fast.HasAttribAccess.__name__ = true;
haxe.xml._Fast.HasAttribAccess.prototype = {
	__class__: haxe.xml._Fast.HasAttribAccess
};
haxe.xml._Fast.HasNodeAccess = function(x) {
	this.__x = x;
};
$hxClasses["haxe.xml._Fast.HasNodeAccess"] = haxe.xml._Fast.HasNodeAccess;
haxe.xml._Fast.HasNodeAccess.__name__ = true;
haxe.xml._Fast.HasNodeAccess.prototype = {
	__class__: haxe.xml._Fast.HasNodeAccess
};
haxe.xml._Fast.NodeListAccess = function(x) {
	this.__x = x;
};
$hxClasses["haxe.xml._Fast.NodeListAccess"] = haxe.xml._Fast.NodeListAccess;
haxe.xml._Fast.NodeListAccess.__name__ = true;
haxe.xml._Fast.NodeListAccess.prototype = {
	__class__: haxe.xml._Fast.NodeListAccess
};
haxe.xml.Fast = function(x) {
	if(x.nodeType != Xml.Document && x.nodeType != Xml.Element) throw "Invalid nodeType " + Std.string(x.nodeType);
	this.x = x;
	this.node = new haxe.xml._Fast.NodeAccess(x);
	this.nodes = new haxe.xml._Fast.NodeListAccess(x);
	this.att = new haxe.xml._Fast.AttribAccess(x);
	this.has = new haxe.xml._Fast.HasAttribAccess(x);
	this.hasNode = new haxe.xml._Fast.HasNodeAccess(x);
};
$hxClasses["haxe.xml.Fast"] = haxe.xml.Fast;
haxe.xml.Fast.__name__ = true;
haxe.xml.Fast.prototype = {
	get_name: function() {
		if(this.x.nodeType == Xml.Document) return "Document"; else return this.x.get_nodeName();
	}
	,get_innerData: function() {
		var it = this.x.iterator();
		if(!it.hasNext()) throw this.get_name() + " does not have data";
		var v = it.next();
		var n = it.next();
		if(n != null) {
			if(v.nodeType == Xml.PCData && n.nodeType == Xml.CData && StringTools.trim(v.get_nodeValue()) == "") {
				var n2 = it.next();
				if(n2 == null || n2.nodeType == Xml.PCData && StringTools.trim(n2.get_nodeValue()) == "" && it.next() == null) return n.get_nodeValue();
			}
			throw this.get_name() + " does not only have data";
		}
		if(v.nodeType != Xml.PCData && v.nodeType != Xml.CData) throw this.get_name() + " does not have data";
		return v.get_nodeValue();
	}
	,get_elements: function() {
		var it = this.x.elements();
		return { hasNext : $bind(it,it.hasNext), next : function() {
			var x = it.next();
			if(x == null) return null;
			return new haxe.xml.Fast(x);
		}};
	}
	,__class__: haxe.xml.Fast
	,__properties__: {get_elements:"get_elements",get_innerData:"get_innerData",get_name:"get_name"}
};
haxe.xml.Parser = function() { };
$hxClasses["haxe.xml.Parser"] = haxe.xml.Parser;
haxe.xml.Parser.__name__ = true;
haxe.xml.Parser.parse = function(str) {
	var doc = Xml.createDocument();
	haxe.xml.Parser.doParse(str,0,doc);
	return doc;
};
haxe.xml.Parser.doParse = function(str,p,parent) {
	if(p == null) p = 0;
	var xml = null;
	var state = 1;
	var next = 1;
	var aname = null;
	var start = 0;
	var nsubs = 0;
	var nbrackets = 0;
	var c = str.charCodeAt(p);
	var buf = new StringBuf();
	while(!(c != c)) {
		switch(state) {
		case 0:
			switch(c) {
			case 10:case 13:case 9:case 32:
				break;
			default:
				state = next;
				continue;
			}
			break;
		case 1:
			switch(c) {
			case 60:
				state = 0;
				next = 2;
				break;
			default:
				start = p;
				state = 13;
				continue;
			}
			break;
		case 13:
			if(c == 60) {
				var child = Xml.createPCData(buf.b + HxOverrides.substr(str,start,p - start));
				buf = new StringBuf();
				parent.addChild(child);
				nsubs++;
				state = 0;
				next = 2;
			} else if(c == 38) {
				buf.addSub(str,start,p - start);
				state = 18;
				next = 13;
				start = p + 1;
			}
			break;
		case 17:
			if(c == 93 && str.charCodeAt(p + 1) == 93 && str.charCodeAt(p + 2) == 62) {
				var child1 = Xml.createCData(HxOverrides.substr(str,start,p - start));
				parent.addChild(child1);
				nsubs++;
				p += 2;
				state = 1;
			}
			break;
		case 2:
			switch(c) {
			case 33:
				if(str.charCodeAt(p + 1) == 91) {
					p += 2;
					if(HxOverrides.substr(str,p,6).toUpperCase() != "CDATA[") throw "Expected <![CDATA[";
					p += 5;
					state = 17;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) == 68 || str.charCodeAt(p + 1) == 100) {
					if(HxOverrides.substr(str,p + 2,6).toUpperCase() != "OCTYPE") throw "Expected <!DOCTYPE";
					p += 8;
					state = 16;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) != 45 || str.charCodeAt(p + 2) != 45) throw "Expected <!--"; else {
					p += 2;
					state = 15;
					start = p + 1;
				}
				break;
			case 63:
				state = 14;
				start = p;
				break;
			case 47:
				if(parent == null) throw "Expected node name";
				start = p + 1;
				state = 0;
				next = 10;
				break;
			default:
				state = 3;
				start = p;
				continue;
			}
			break;
		case 3:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(p == start) throw "Expected node name";
				xml = Xml.createElement(HxOverrides.substr(str,start,p - start));
				parent.addChild(xml);
				state = 0;
				next = 4;
				continue;
			}
			break;
		case 4:
			switch(c) {
			case 47:
				state = 11;
				nsubs++;
				break;
			case 62:
				state = 9;
				nsubs++;
				break;
			default:
				state = 5;
				start = p;
				continue;
			}
			break;
		case 5:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				var tmp;
				if(start == p) throw "Expected attribute name";
				tmp = HxOverrides.substr(str,start,p - start);
				aname = tmp;
				if(xml.exists(aname)) throw "Duplicate attribute";
				state = 0;
				next = 6;
				continue;
			}
			break;
		case 6:
			switch(c) {
			case 61:
				state = 0;
				next = 7;
				break;
			default:
				throw "Expected =";
			}
			break;
		case 7:
			switch(c) {
			case 34:case 39:
				state = 8;
				start = p;
				break;
			default:
				throw "Expected \"";
			}
			break;
		case 8:
			if(c == str.charCodeAt(start)) {
				var val = HxOverrides.substr(str,start + 1,p - start - 1);
				xml.set(aname,val);
				state = 0;
				next = 4;
			}
			break;
		case 9:
			p = haxe.xml.Parser.doParse(str,p,xml);
			start = p;
			state = 1;
			break;
		case 11:
			switch(c) {
			case 62:
				state = 1;
				break;
			default:
				throw "Expected >";
			}
			break;
		case 12:
			switch(c) {
			case 62:
				if(nsubs == 0) parent.addChild(Xml.createPCData(""));
				return p;
			default:
				throw "Expected >";
			}
			break;
		case 10:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(start == p) throw "Expected node name";
				var v = HxOverrides.substr(str,start,p - start);
				if(v != parent.get_nodeName()) throw "Expected </" + parent.get_nodeName() + ">";
				state = 0;
				next = 12;
				continue;
			}
			break;
		case 15:
			if(c == 45 && str.charCodeAt(p + 1) == 45 && str.charCodeAt(p + 2) == 62) {
				parent.addChild(Xml.createComment(HxOverrides.substr(str,start,p - start)));
				p += 2;
				state = 1;
			}
			break;
		case 16:
			if(c == 91) nbrackets++; else if(c == 93) nbrackets--; else if(c == 62 && nbrackets == 0) {
				parent.addChild(Xml.createDocType(HxOverrides.substr(str,start,p - start)));
				state = 1;
			}
			break;
		case 14:
			if(c == 63 && str.charCodeAt(p + 1) == 62) {
				p++;
				var str1 = HxOverrides.substr(str,start + 1,p - start - 2);
				parent.addChild(Xml.createProcessingInstruction(str1));
				state = 1;
			}
			break;
		case 18:
			if(c == 59) {
				var s = HxOverrides.substr(str,start,p - start);
				if(s.charCodeAt(0) == 35) {
					var i;
					if(s.charCodeAt(1) == 120) i = Std.parseInt("0" + HxOverrides.substr(s,1,s.length - 1)); else i = Std.parseInt(HxOverrides.substr(s,1,s.length - 1));
					buf.add(String.fromCharCode(i));
				} else if(!haxe.xml.Parser.escapes.exists(s)) buf.b += Std.string("&" + s + ";"); else buf.add(haxe.xml.Parser.escapes.get(s));
				start = p + 1;
				state = next;
			}
			break;
		}
		c = StringTools.fastCodeAt(str,++p);
	}
	if(state == 1) {
		start = p;
		state = 13;
	}
	if(state == 13) {
		if(p != start || nsubs == 0) parent.addChild(Xml.createPCData(buf.b + HxOverrides.substr(str,start,p - start)));
		return p;
	}
	throw "Unexpected end";
};
hxd._BitmapData = {};
hxd._BitmapData.BitmapData_Impl_ = function() { };
$hxClasses["hxd._BitmapData.BitmapData_Impl_"] = hxd._BitmapData.BitmapData_Impl_;
hxd._BitmapData.BitmapData_Impl_.__name__ = true;
hxd._BitmapData.BitmapData_Impl_.nativeGetPixels = function(b) {
	var pixels = [];
	var w = b.canvas.width;
	var h = b.canvas.height;
	var data = b.getImageData(0,0,w,h).data;
	var _g1 = 0;
	var _g = w * h * 4;
	while(_g1 < _g) {
		var i = _g1++;
		pixels.push(data[i]);
	}
	return new hxd.Pixels(b.canvas.width,b.canvas.height,haxe.io.Bytes.ofData(pixels),hxd.PixelFormat.RGBA);
};
hxd._BitmapData.BitmapData_Impl_.nativeSetPixels = function(b,pixels) {
	var img = b.createImageData(pixels.width,pixels.height);
	pixels.convert(hxd.PixelFormat.RGBA);
	var _g1 = 0;
	var _g = pixels.width * pixels.height * 4;
	while(_g1 < _g) {
		var i = _g1++;
		img.data[i] = pixels.bytes.b[i];
	}
	b.putImageData(img,0,0);
};
hxd._BitmapData.BitmapData_Impl_.canvasGetPixel = function(b,x,y) {
	var i = b.lockImage;
	var a;
	if(i != null) a = x + y * i.width << 2; else {
		a = 0;
		i = b.getImageData(x,y,1,1);
	}
	return i.data[a] << 16 | i.data[a | 1] << 8 | i.data[a | 2] | i.data[a | 3] << 24;
};
hxd.EventKind = $hxClasses["hxd.EventKind"] = { __ename__ : true, __constructs__ : ["EPush","ERelease","EMove","EOver","EOut","EWheel","EFocus","EFocusLost","EKeyDown","EKeyUp"] };
hxd.EventKind.EPush = ["EPush",0];
hxd.EventKind.EPush.toString = $estr;
hxd.EventKind.EPush.__enum__ = hxd.EventKind;
hxd.EventKind.ERelease = ["ERelease",1];
hxd.EventKind.ERelease.toString = $estr;
hxd.EventKind.ERelease.__enum__ = hxd.EventKind;
hxd.EventKind.EMove = ["EMove",2];
hxd.EventKind.EMove.toString = $estr;
hxd.EventKind.EMove.__enum__ = hxd.EventKind;
hxd.EventKind.EOver = ["EOver",3];
hxd.EventKind.EOver.toString = $estr;
hxd.EventKind.EOver.__enum__ = hxd.EventKind;
hxd.EventKind.EOut = ["EOut",4];
hxd.EventKind.EOut.toString = $estr;
hxd.EventKind.EOut.__enum__ = hxd.EventKind;
hxd.EventKind.EWheel = ["EWheel",5];
hxd.EventKind.EWheel.toString = $estr;
hxd.EventKind.EWheel.__enum__ = hxd.EventKind;
hxd.EventKind.EFocus = ["EFocus",6];
hxd.EventKind.EFocus.toString = $estr;
hxd.EventKind.EFocus.__enum__ = hxd.EventKind;
hxd.EventKind.EFocusLost = ["EFocusLost",7];
hxd.EventKind.EFocusLost.toString = $estr;
hxd.EventKind.EFocusLost.__enum__ = hxd.EventKind;
hxd.EventKind.EKeyDown = ["EKeyDown",8];
hxd.EventKind.EKeyDown.toString = $estr;
hxd.EventKind.EKeyDown.__enum__ = hxd.EventKind;
hxd.EventKind.EKeyUp = ["EKeyUp",9];
hxd.EventKind.EKeyUp.toString = $estr;
hxd.EventKind.EKeyUp.__enum__ = hxd.EventKind;
hxd.EventKind.__empty_constructs__ = [hxd.EventKind.EPush,hxd.EventKind.ERelease,hxd.EventKind.EMove,hxd.EventKind.EOver,hxd.EventKind.EOut,hxd.EventKind.EWheel,hxd.EventKind.EFocus,hxd.EventKind.EFocusLost,hxd.EventKind.EKeyDown,hxd.EventKind.EKeyUp];
hxd.Event = function(k,x,y) {
	if(y == null) y = 0.;
	if(x == null) x = 0.;
	this.button = 0;
	this.kind = k;
	this.relX = x;
	this.relY = y;
};
$hxClasses["hxd.Event"] = hxd.Event;
hxd.Event.__name__ = true;
hxd.Event.prototype = {
	__class__: hxd.Event
};
hxd.Key = function() { };
$hxClasses["hxd.Key"] = hxd.Key;
hxd.Key.__name__ = true;
hxd.Key.isDown = function(code) {
	return hxd.Key.keyPressed[code] > 0;
};
hxd.Key.initialize = function() {
	if(hxd.Key.initDone) hxd.Key.dispose();
	hxd.Key.initDone = true;
	hxd.Key.keyPressed = [];
	hxd.Stage.getInstance().addEventTarget(hxd.Key.onEvent);
};
hxd.Key.dispose = function() {
	if(hxd.Key.initDone) {
		hxd.Stage.getInstance().removeEventTarget(hxd.Key.onEvent);
		hxd.Key.initDone = false;
		hxd.Key.keyPressed = [];
	}
};
hxd.Key.onEvent = function(e) {
	var _g = e.kind;
	switch(_g[1]) {
	case 8:
		hxd.Key.keyPressed[e.keyCode] = h3d.Engine.CURRENT.frameCount + 1;
		break;
	case 9:
		hxd.Key.keyPressed[e.keyCode] = -(h3d.Engine.CURRENT.frameCount + 1);
		break;
	case 0:
		hxd.Key.keyPressed[e.button] = h3d.Engine.CURRENT.frameCount + 1;
		break;
	case 1:
		hxd.Key.keyPressed[e.button] = -(h3d.Engine.CURRENT.frameCount + 1);
		break;
	default:
	}
};
hxd.Math = function() { };
$hxClasses["hxd.Math"] = hxd.Math;
hxd.Math.__name__ = true;
hxd.Math.distanceSq = function(dx,dy,dz) {
	if(dz == null) dz = 0.;
	return dx * dx + dy * dy + dz * dz;
};
hxd.PixelFormat = $hxClasses["hxd.PixelFormat"] = { __ename__ : true, __constructs__ : ["ARGB","BGRA","RGBA"] };
hxd.PixelFormat.ARGB = ["ARGB",0];
hxd.PixelFormat.ARGB.toString = $estr;
hxd.PixelFormat.ARGB.__enum__ = hxd.PixelFormat;
hxd.PixelFormat.BGRA = ["BGRA",1];
hxd.PixelFormat.BGRA.toString = $estr;
hxd.PixelFormat.BGRA.__enum__ = hxd.PixelFormat;
hxd.PixelFormat.RGBA = ["RGBA",2];
hxd.PixelFormat.RGBA.toString = $estr;
hxd.PixelFormat.RGBA.__enum__ = hxd.PixelFormat;
hxd.PixelFormat.__empty_constructs__ = [hxd.PixelFormat.ARGB,hxd.PixelFormat.BGRA,hxd.PixelFormat.RGBA];
hxd.Flags = $hxClasses["hxd.Flags"] = { __ename__ : true, __constructs__ : ["ReadOnly","AlphaPremultiplied"] };
hxd.Flags.ReadOnly = ["ReadOnly",0];
hxd.Flags.ReadOnly.toString = $estr;
hxd.Flags.ReadOnly.__enum__ = hxd.Flags;
hxd.Flags.AlphaPremultiplied = ["AlphaPremultiplied",1];
hxd.Flags.AlphaPremultiplied.toString = $estr;
hxd.Flags.AlphaPremultiplied.__enum__ = hxd.Flags;
hxd.Flags.__empty_constructs__ = [hxd.Flags.ReadOnly,hxd.Flags.AlphaPremultiplied];
hxd.Pixels = function(width,height,bytes,format,offset) {
	if(offset == null) offset = 0;
	this.width = width;
	this.height = height;
	this.bytes = bytes;
	this.format = format;
	this.offset = offset;
};
$hxClasses["hxd.Pixels"] = hxd.Pixels;
hxd.Pixels.__name__ = true;
hxd.Pixels.bytesPerPixel = function(format) {
	switch(format[1]) {
	case 0:case 1:case 2:
		return 4;
	}
};
hxd.Pixels.alloc = function(width,height,format) {
	return new hxd.Pixels(width,height,hxd.impl.Tmp.getBytes(width * height * hxd.Pixels.bytesPerPixel(format)),format);
};
hxd.Pixels.prototype = {
	makeSquare: function(copy) {
		var w = this.width;
		var h = this.height;
		var tw;
		if(w == 0) tw = 0; else tw = 1;
		var th;
		if(h == 0) th = 0; else th = 1;
		while(tw < w) tw <<= 1;
		while(th < h) th <<= 1;
		if(w == tw && h == th) return this;
		var out = hxd.impl.Tmp.getBytes(tw * th * 4);
		var p = 0;
		var b = this.offset;
		var _g = 0;
		while(_g < h) {
			var y = _g++;
			out.blit(p,this.bytes,b,w * 4);
			p += w * 4;
			b += w * 4;
			var _g2 = 0;
			var _g1 = (tw - w) * 4;
			while(_g2 < _g1) {
				var i = _g2++;
				out.set(p++,0);
			}
		}
		var _g11 = 0;
		var _g3 = (th - h) * tw * 4;
		while(_g11 < _g3) {
			var i1 = _g11++;
			out.set(p++,0);
		}
		if(copy) return new hxd.Pixels(tw,th,out,this.format);
		if(!((this.flags & 1 << hxd.Flags.ReadOnly[1]) != 0)) hxd.impl.Tmp.saveBytes(this.bytes);
		this.bytes = out;
		this.width = tw;
		this.height = th;
		return this;
	}
	,copyInner: function() {
		var old = this.bytes;
		this.bytes = hxd.impl.Tmp.getBytes(this.width * this.height * 4);
		this.bytes.blit(0,old,this.offset,this.width * this.height * 4);
		this.offset = 0;
		this.flags &= 268435455 - (1 << hxd.Flags.ReadOnly[1]);
	}
	,convert: function(target) {
		if(this.format == target) return;
		if((this.flags & 1 << hxd.Flags.ReadOnly[1]) != 0) this.copyInner();
		{
			var _g = this.format;
			switch(_g[1]) {
			case 1:
				switch(target[1]) {
				case 0:
					var mem = hxd.impl.Memory.select(this.bytes);
					var _g2 = 0;
					var _g1 = this.width * this.height;
					while(_g2 < _g1) {
						var i = _g2++;
						var p = (i << 2) + this.offset;
						var a = hxd.impl.Memory.current.b[p];
						var r = hxd.impl.Memory.current.b[p + 1];
						var g = hxd.impl.Memory.current.b[p + 2];
						var b = hxd.impl.Memory.current.b[p + 3];
						hxd.impl.Memory.current.b[p] = b & 255;
						hxd.impl.Memory.current.b[p + 1] = g & 255;
						hxd.impl.Memory.current.b[p + 2] = r & 255;
						hxd.impl.Memory.current.b[p + 3] = a & 255;
					}
					hxd.impl.Memory.end();
					break;
				case 2:
					var mem1 = hxd.impl.Memory.select(this.bytes);
					var _g21 = 0;
					var _g11 = this.width * this.height;
					while(_g21 < _g11) {
						var i1 = _g21++;
						var p1 = (i1 << 2) + this.offset;
						var b1 = hxd.impl.Memory.current.b[p1];
						var r1 = hxd.impl.Memory.current.b[p1 + 2];
						hxd.impl.Memory.current.b[p1] = r1 & 255;
						hxd.impl.Memory.current.b[p1 + 2] = b1 & 255;
					}
					hxd.impl.Memory.end();
					break;
				default:
					throw "Cannot convert from " + Std.string(this.format) + " to " + Std.string(target);
				}
				break;
			case 0:
				switch(target[1]) {
				case 1:
					var mem = hxd.impl.Memory.select(this.bytes);
					var _g2 = 0;
					var _g1 = this.width * this.height;
					while(_g2 < _g1) {
						var i = _g2++;
						var p = (i << 2) + this.offset;
						var a = hxd.impl.Memory.current.b[p];
						var r = hxd.impl.Memory.current.b[p + 1];
						var g = hxd.impl.Memory.current.b[p + 2];
						var b = hxd.impl.Memory.current.b[p + 3];
						hxd.impl.Memory.current.b[p] = b & 255;
						hxd.impl.Memory.current.b[p + 1] = g & 255;
						hxd.impl.Memory.current.b[p + 2] = r & 255;
						hxd.impl.Memory.current.b[p + 3] = a & 255;
					}
					hxd.impl.Memory.end();
					break;
				case 2:
					var mem2 = hxd.impl.Memory.select(this.bytes);
					var _g22 = 0;
					var _g12 = this.width * this.height;
					while(_g22 < _g12) {
						var i2 = _g22++;
						var p2 = (i2 << 2) + this.offset;
						var a1 = hxd.impl.Memory.current.b[p2];
						hxd.impl.Memory.current.b[p2] = hxd.impl.Memory.current.b[p2 + 1] & 255;
						hxd.impl.Memory.current.b[p2 + 1] = hxd.impl.Memory.current.b[p2 + 2] & 255;
						hxd.impl.Memory.current.b[p2 + 2] = hxd.impl.Memory.current.b[p2 + 3] & 255;
						hxd.impl.Memory.current.b[p2 + 3] = a1 & 255;
					}
					hxd.impl.Memory.end();
					break;
				default:
					throw "Cannot convert from " + Std.string(this.format) + " to " + Std.string(target);
				}
				break;
			default:
				throw "Cannot convert from " + Std.string(this.format) + " to " + Std.string(target);
			}
		}
		this.format = target;
	}
	,dispose: function() {
		if(this.bytes != null) {
			if(!((this.flags & 1 << hxd.Flags.ReadOnly[1]) != 0)) hxd.impl.Tmp.saveBytes(this.bytes);
			this.bytes = null;
		}
	}
	,__class__: hxd.Pixels
};
hxd.Res = function() { };
$hxClasses["hxd.Res"] = hxd.Res;
hxd.Res.__name__ = true;
hxd.Stage = function() {
	this.curMouseY = 0.;
	this.curMouseX = 0.;
	var _g = this;
	this.eventTargets = new List();
	this.resizeEvents = new List();
	this.canvas = hxd.Stage.getCanvas();
	this.canvasPos = this.canvas.getBoundingClientRect();
	window.addEventListener("mousedown",$bind(this,this.onMouseDown));
	window.addEventListener("mousemove",$bind(this,this.onMouseMove));
	window.addEventListener("mouseup",$bind(this,this.onMouseUp));
	window.addEventListener("mousewheel",$bind(this,this.onMouseWheel));
	window.addEventListener("keydown",$bind(this,this.onKeyDown));
	window.addEventListener("keyup",$bind(this,this.onKeyUp));
	this.canvas.addEventListener("mousedown",function(e) {
		_g.onMouseDown(e);
		e.stopPropagation();
		e.preventDefault();
	});
	var curW = this.get_width();
	var curH = this.get_height();
	var t0 = new haxe.Timer(100);
	t0.run = function() {
		_g.canvasPos = _g.canvas.getBoundingClientRect();
		var cw = _g.get_width();
		var ch = _g.get_height();
		if(curW != cw || curH != ch) {
			curW = cw;
			curH = ch;
			_g.onResize(null);
		}
	};
};
$hxClasses["hxd.Stage"] = hxd.Stage;
hxd.Stage.__name__ = true;
hxd.Stage.getCanvas = function() {
	var canvas = window.document.getElementById("webgl");
	if(canvas == null) throw "Missing canvas#webgl";
	return canvas;
};
hxd.Stage.getInstance = function() {
	if(hxd.Stage.inst == null) hxd.Stage.inst = new hxd.Stage();
	return hxd.Stage.inst;
};
hxd.Stage.prototype = {
	event: function(e) {
		var $it0 = this.eventTargets.iterator();
		while( $it0.hasNext() ) {
			var et = $it0.next();
			et(e);
		}
	}
	,addEventTarget: function(et) {
		this.eventTargets.add(et);
	}
	,removeEventTarget: function(et) {
		this.eventTargets.remove(et);
	}
	,addResizeEvent: function(f) {
		this.resizeEvents.push(f);
	}
	,getFrameRate: function() {
		return 60.;
	}
	,setFullScreen: function(v) {
	}
	,get_width: function() {
		return Math.round(this.canvasPos.width * window.devicePixelRatio);
	}
	,get_height: function() {
		return Math.round(this.canvasPos.height * window.devicePixelRatio);
	}
	,get_mouseX: function() {
		return Math.round((this.curMouseX - this.canvasPos.left) * window.devicePixelRatio);
	}
	,get_mouseY: function() {
		return Math.round((this.curMouseY - this.canvasPos.top) * window.devicePixelRatio);
	}
	,onMouseDown: function(e) {
		this.event(new hxd.Event(hxd.EventKind.EPush,this.get_mouseX(),this.get_mouseY()));
	}
	,onMouseUp: function(e) {
		this.event(new hxd.Event(hxd.EventKind.ERelease,this.get_mouseX(),this.get_mouseY()));
	}
	,onMouseMove: function(e) {
		this.curMouseX = e.clientX;
		this.curMouseY = e.clientY;
		this.event(new hxd.Event(hxd.EventKind.EMove,this.get_mouseX(),this.get_mouseY()));
	}
	,onMouseWheel: function(e) {
		var ev = new hxd.Event(hxd.EventKind.EWheel,this.get_mouseX(),this.get_mouseY());
		ev.wheelDelta = -e.wheelDelta / 30.0;
		this.event(ev);
	}
	,onKeyUp: function(e) {
		var ev = new hxd.Event(hxd.EventKind.EKeyUp,this.get_mouseX(),this.get_mouseY());
		ev.keyCode = e.keyCode;
		ev.charCode = e.charCode;
		this.event(ev);
	}
	,onKeyDown: function(e) {
		var ev = new hxd.Event(hxd.EventKind.EKeyDown,this.get_mouseX(),this.get_mouseY());
		ev.keyCode = e.keyCode;
		ev.charCode = e.charCode;
		this.event(ev);
	}
	,onResize: function(e) {
		var $it0 = this.resizeEvents.iterator();
		while( $it0.hasNext() ) {
			var r = $it0.next();
			r();
		}
	}
	,__class__: hxd.Stage
	,__properties__: {get_mouseY:"get_mouseY",get_mouseX:"get_mouseX",get_height:"get_height",get_width:"get_width"}
};
hxd.Cursor = $hxClasses["hxd.Cursor"] = { __ename__ : true, __constructs__ : ["Default","Button","Move","TextInput","Hide","Custom"] };
hxd.Cursor.Default = ["Default",0];
hxd.Cursor.Default.toString = $estr;
hxd.Cursor.Default.__enum__ = hxd.Cursor;
hxd.Cursor.Button = ["Button",1];
hxd.Cursor.Button.toString = $estr;
hxd.Cursor.Button.__enum__ = hxd.Cursor;
hxd.Cursor.Move = ["Move",2];
hxd.Cursor.Move.toString = $estr;
hxd.Cursor.Move.__enum__ = hxd.Cursor;
hxd.Cursor.TextInput = ["TextInput",3];
hxd.Cursor.TextInput.toString = $estr;
hxd.Cursor.TextInput.__enum__ = hxd.Cursor;
hxd.Cursor.Hide = ["Hide",4];
hxd.Cursor.Hide.toString = $estr;
hxd.Cursor.Hide.__enum__ = hxd.Cursor;
hxd.Cursor.Custom = function(frames,speed,offsetX,offsetY) { var $x = ["Custom",5,frames,speed,offsetX,offsetY]; $x.__enum__ = hxd.Cursor; $x.toString = $estr; return $x; };
hxd.Cursor.__empty_constructs__ = [hxd.Cursor.Default,hxd.Cursor.Button,hxd.Cursor.Move,hxd.Cursor.TextInput,hxd.Cursor.Hide];
hxd.System = function() { };
$hxClasses["hxd.System"] = hxd.System;
hxd.System.__name__ = true;
hxd.System.__properties__ = {get_isWindowed:"get_isWindowed"}
hxd.System.loopFunc = function() {
	var $window = window;
	var rqf = $window.requestAnimationFrame || $window.webkitRequestAnimationFrame || $window.mozRequestAnimationFrame;
	rqf(hxd.System.loopFunc);
	if(hxd.System.LOOP != null) hxd.System.LOOP();
};
hxd.System.setLoop = function(f) {
	if(!hxd.System.LOOP_INIT) {
		hxd.System.LOOP_INIT = true;
		hxd.System.loopFunc();
	}
	hxd.System.LOOP = f;
};
hxd.System.setNativeCursor = function(c) {
	var canvas = window.document.getElementById("webgl");
	if(canvas != null) switch(c[1]) {
	case 0:
		canvas.style.cursor = "default";
		break;
	case 1:
		canvas.style.cursor = "pointer";
		break;
	case 2:
		canvas.style.cursor = "move";
		break;
	case 3:
		canvas.style.cursor = "text";
		break;
	case 4:
		canvas.style.cursor = "none";
		break;
	case 5:
		throw "Custom cursor not supported";
		break;
	}
};
hxd.System.get_isWindowed = function() {
	return true;
};
hxd.Timer = function() { };
$hxClasses["hxd.Timer"] = hxd.Timer;
hxd.Timer.__name__ = true;
hxd.Timer.update = function() {
	hxd.Timer.frameCount++;
	var newTime = haxe.Timer.stamp();
	hxd.Timer.deltaT = newTime - hxd.Timer.oldTime;
	hxd.Timer.oldTime = newTime;
	if(hxd.Timer.deltaT < hxd.Timer.maxDeltaTime) hxd.Timer.calc_tmod = hxd.Timer.calc_tmod * hxd.Timer.tmod_factor + (1 - hxd.Timer.tmod_factor) * hxd.Timer.deltaT * hxd.Timer.wantedFPS; else hxd.Timer.deltaT = 1 / hxd.Timer.wantedFPS;
	hxd.Timer.tmod = hxd.Timer.calc_tmod;
};
hxd.Timer.skip = function() {
	hxd.Timer.oldTime = haxe.Timer.stamp();
};
hxd.fmt = {};
hxd.fmt.fbx = {};
hxd.fmt.fbx.FbxProp = $hxClasses["hxd.fmt.fbx.FbxProp"] = { __ename__ : true, __constructs__ : ["PInt","PFloat","PString","PIdent","PInts","PFloats"] };
hxd.fmt.fbx.FbxProp.PInt = function(v) { var $x = ["PInt",0,v]; $x.__enum__ = hxd.fmt.fbx.FbxProp; $x.toString = $estr; return $x; };
hxd.fmt.fbx.FbxProp.PFloat = function(v) { var $x = ["PFloat",1,v]; $x.__enum__ = hxd.fmt.fbx.FbxProp; $x.toString = $estr; return $x; };
hxd.fmt.fbx.FbxProp.PString = function(v) { var $x = ["PString",2,v]; $x.__enum__ = hxd.fmt.fbx.FbxProp; $x.toString = $estr; return $x; };
hxd.fmt.fbx.FbxProp.PIdent = function(i) { var $x = ["PIdent",3,i]; $x.__enum__ = hxd.fmt.fbx.FbxProp; $x.toString = $estr; return $x; };
hxd.fmt.fbx.FbxProp.PInts = function(v) { var $x = ["PInts",4,v]; $x.__enum__ = hxd.fmt.fbx.FbxProp; $x.toString = $estr; return $x; };
hxd.fmt.fbx.FbxProp.PFloats = function(v) { var $x = ["PFloats",5,v]; $x.__enum__ = hxd.fmt.fbx.FbxProp; $x.toString = $estr; return $x; };
hxd.fmt.fbx.FbxProp.__empty_constructs__ = [];
hxd.fmt.fbx.FbxTools = function() { };
$hxClasses["hxd.fmt.fbx.FbxTools"] = hxd.fmt.fbx.FbxTools;
hxd.fmt.fbx.FbxTools.__name__ = true;
hxd.fmt.fbx.FbxTools.get = function(n,path,opt) {
	if(opt == null) opt = false;
	var parts = path.split(".");
	var cur = n;
	var _g = 0;
	while(_g < parts.length) {
		var p = parts[_g];
		++_g;
		var found = false;
		var _g1 = 0;
		var _g2 = cur.childs;
		while(_g1 < _g2.length) {
			var c = _g2[_g1];
			++_g1;
			if(c.name == p) {
				cur = c;
				found = true;
				break;
			}
		}
		if(!found) {
			if(opt) return null;
			throw n.name + " does not have " + path + " (" + p + " not found)";
		}
	}
	return cur;
};
hxd.fmt.fbx.FbxTools.getAll = function(n,path) {
	var parts = path.split(".");
	var cur = [n];
	var _g = 0;
	while(_g < parts.length) {
		var p = parts[_g];
		++_g;
		var out = [];
		var _g1 = 0;
		while(_g1 < cur.length) {
			var n1 = cur[_g1];
			++_g1;
			var _g2 = 0;
			var _g3 = n1.childs;
			while(_g2 < _g3.length) {
				var c = _g3[_g2];
				++_g2;
				if(c.name == p) out.push(c);
			}
		}
		cur = out;
		if(cur.length == 0) return cur;
	}
	return cur;
};
hxd.fmt.fbx.FbxTools.getInts = function(n) {
	if(n.props.length != 1) throw n.name + " has " + Std.string(n.props) + " props";
	{
		var _g = n.props[0];
		switch(_g[1]) {
		case 4:
			var v = _g[2];
			return v;
		default:
			throw n.name + " has " + Std.string(n.props) + " props";
		}
	}
};
hxd.fmt.fbx.FbxTools.getFloats = function(n) {
	if(n.props.length != 1) throw n.name + " has " + Std.string(n.props) + " props";
	{
		var _g = n.props[0];
		switch(_g[1]) {
		case 5:
			var v = _g[2];
			return v;
		case 4:
			var i = _g[2];
			var fl = new Array();
			var _g1 = 0;
			while(_g1 < i.length) {
				var x = i[_g1];
				++_g1;
				fl.push(x);
			}
			return fl;
		default:
			throw n.name + " has " + Std.string(n.props) + " props";
		}
	}
};
hxd.fmt.fbx.FbxTools.hasProp = function(n,p) {
	var _g = 0;
	var _g1 = n.props;
	while(_g < _g1.length) {
		var p2 = _g1[_g];
		++_g;
		if(Type.enumEq(p,p2)) return true;
	}
	return false;
};
hxd.fmt.fbx.FbxTools.toInt = function(n) {
	if(n == null) throw "null prop";
	switch(n[1]) {
	case 0:
		var v = n[2];
		return v;
	case 1:
		var f = n[2];
		return f | 0;
	default:
		throw "Invalid prop " + Std.string(n);
	}
};
hxd.fmt.fbx.FbxTools.toFloat = function(n) {
	if(n == null) throw "null prop";
	switch(n[1]) {
	case 0:
		var v = n[2];
		return v * 1.0;
	case 1:
		var v1 = n[2];
		return v1;
	default:
		throw "Invalid prop " + Std.string(n);
	}
};
hxd.fmt.fbx.FbxTools.toString = function(n) {
	if(n == null) throw "null prop";
	switch(n[1]) {
	case 2:
		var v = n[2];
		return v;
	default:
		throw "Invalid prop " + Std.string(n);
	}
};
hxd.fmt.fbx.FbxTools.getId = function(n) {
	if(n.props.length != 3) throw n.name + " is not an object";
	{
		var _g = n.props[0];
		switch(_g[1]) {
		case 0:
			var id = _g[2];
			return id;
		case 1:
			var id1 = _g[2];
			return id1 | 0;
		default:
			throw n.name + " is not an object " + Std.string(n.props);
		}
	}
};
hxd.fmt.fbx.FbxTools.getName = function(n) {
	if(n.props.length != 3) throw n.name + " is not an object";
	{
		var _g = n.props[1];
		switch(_g[1]) {
		case 2:
			var n1 = _g[2];
			return n1.split("::").pop();
		default:
			throw n.name + " is not an object";
		}
	}
};
hxd.fmt.fbx.Geometry = function(l,root) {
	this.lib = l;
	this.root = root;
};
$hxClasses["hxd.fmt.fbx.Geometry"] = hxd.fmt.fbx.Geometry;
hxd.fmt.fbx.Geometry.__name__ = true;
hxd.fmt.fbx.Geometry.prototype = {
	getVertices: function() {
		return hxd.fmt.fbx.FbxTools.getFloats(hxd.fmt.fbx.FbxTools.get(this.root,"Vertices"));
	}
	,getPolygons: function() {
		return hxd.fmt.fbx.FbxTools.getInts(hxd.fmt.fbx.FbxTools.get(this.root,"PolygonVertexIndex"));
	}
	,getMaterials: function() {
		var mats = hxd.fmt.fbx.FbxTools.get(this.root,"LayerElementMaterial",true);
		if(mats == null) return null; else return hxd.fmt.fbx.FbxTools.getInts(hxd.fmt.fbx.FbxTools.get(mats,"Materials"));
	}
	,getNormals: function() {
		var nrm = hxd.fmt.fbx.FbxTools.getFloats(hxd.fmt.fbx.FbxTools.get(this.root,"LayerElementNormal.Normals"));
		if(hxd.fmt.fbx.FbxTools.toString(hxd.fmt.fbx.FbxTools.get(this.root,"LayerElementNormal.MappingInformationType").props[0]) == "ByVertice") {
			var nout = [];
			var _g = 0;
			var _g1 = this.getPolygons();
			while(_g < _g1.length) {
				var i = _g1[_g];
				++_g;
				var vid = i;
				if(vid < 0) vid = -vid - 1;
				nout.push(nrm[vid * 3]);
				nout.push(nrm[vid * 3 + 1]);
				nout.push(nrm[vid * 3 + 2]);
			}
			nrm = nout;
		}
		return nrm;
	}
	,getColors: function() {
		var color = hxd.fmt.fbx.FbxTools.get(this.root,"LayerElementColor",true);
		if(color == null) return null; else return { values : hxd.fmt.fbx.FbxTools.getFloats(hxd.fmt.fbx.FbxTools.get(color,"Colors")), index : hxd.fmt.fbx.FbxTools.getInts(hxd.fmt.fbx.FbxTools.get(color,"ColorIndex"))};
	}
	,getUVs: function() {
		var uvs = [];
		var _g = 0;
		var _g1 = hxd.fmt.fbx.FbxTools.getAll(this.root,"LayerElementUV");
		while(_g < _g1.length) {
			var v = _g1[_g];
			++_g;
			var index = hxd.fmt.fbx.FbxTools.get(v,"UVIndex",true);
			var values = hxd.fmt.fbx.FbxTools.getFloats(hxd.fmt.fbx.FbxTools.get(v,"UV"));
			var index1;
			if(index == null) {
				var _g2 = [];
				var _g3 = 0;
				var _g4 = this.getPolygons();
				while(_g3 < _g4.length) {
					var i = _g4[_g3];
					++_g3;
					_g2.push(i < 0?-i - 1:i);
				}
				index1 = _g2;
			} else index1 = hxd.fmt.fbx.FbxTools.getInts(index);
			uvs.push({ values : values, index : index1});
		}
		return uvs;
	}
	,getGeomTranslate: function() {
		var _g = 0;
		var _g1 = hxd.fmt.fbx.FbxTools.getAll(this.lib.getParent(this.root,"Model"),"Properties70.P");
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			if(hxd.fmt.fbx.FbxTools.toString(p.props[0]) == "GeometricTranslation") return new h3d.col.Point(hxd.fmt.fbx.FbxTools.toFloat(p.props[4]) * (this.lib.leftHand?-1:1),hxd.fmt.fbx.FbxTools.toFloat(p.props[5]),hxd.fmt.fbx.FbxTools.toFloat(p.props[6]));
		}
		return null;
	}
	,__class__: hxd.fmt.fbx.Geometry
};
hxd.fmt.fbx.DefaultMatrixes = function() { };
$hxClasses["hxd.fmt.fbx.DefaultMatrixes"] = hxd.fmt.fbx.DefaultMatrixes;
hxd.fmt.fbx.DefaultMatrixes.__name__ = true;
hxd.fmt.fbx.Library = function() {
	this.root = { name : "Root", props : [], childs : []};
	this.keepJoints = new haxe.ds.StringMap();
	this.skipObjects = new haxe.ds.StringMap();
	this.reset();
};
$hxClasses["hxd.fmt.fbx.Library"] = hxd.fmt.fbx.Library;
hxd.fmt.fbx.Library.__name__ = true;
hxd.fmt.fbx.Library.prototype = {
	reset: function() {
		this.ids = new haxe.ds.IntMap();
		this.connect = new haxe.ds.IntMap();
		this.invConnect = new haxe.ds.IntMap();
		this.defaultModelMatrixes = new haxe.ds.StringMap();
	}
	,load: function(root) {
		this.reset();
		this.root = root;
		var _g = 0;
		var _g1 = root.childs;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			this.init(c);
		}
	}
	,loadXtra: function(data) {
		var xml = Xml.parse(data).firstElement();
		if(this.uvAnims == null) this.uvAnims = new haxe.ds.StringMap();
		var $it0 = new haxe.xml.Fast(xml).get_elements();
		while( $it0.hasNext() ) {
			var e = $it0.next();
			var obj = e.att.resolve("name");
			var frames;
			var _g = [];
			var $it1 = e.get_elements();
			while( $it1.hasNext() ) {
				var f = $it1.next();
				_g.push((function($this) {
					var $r;
					var f1 = f.get_innerData().split(" ");
					$r = { t : Std.parseFloat(f1[0]) * 9622116.25, u : Std.parseFloat(f1[1]), v : Std.parseFloat(f1[2])};
					return $r;
				}(this)));
			}
			frames = _g;
			this.uvAnims.set(obj,frames);
		}
	}
	,convertPoints: function(a) {
		var p = 0;
		var _g1 = 0;
		var _g = a.length / 3 | 0;
		while(_g1 < _g) {
			var i = _g1++;
			a[p] = -a[p];
			p += 3;
		}
	}
	,leftHandConvert: function() {
		if(this.leftHand) return;
		this.leftHand = true;
		var _g = 0;
		var _g1 = hxd.fmt.fbx.FbxTools.getAll(this.root,"Objects.Geometry");
		while(_g < _g1.length) {
			var g = _g1[_g];
			++_g;
			var _g2 = 0;
			var _g3 = hxd.fmt.fbx.FbxTools.getAll(g,"Vertices");
			while(_g2 < _g3.length) {
				var v = _g3[_g2];
				++_g2;
				this.convertPoints(hxd.fmt.fbx.FbxTools.getFloats(v));
			}
			var _g21 = 0;
			var _g31 = hxd.fmt.fbx.FbxTools.getAll(g,"LayerElementNormal.Normals");
			while(_g21 < _g31.length) {
				var v1 = _g31[_g21];
				++_g21;
				this.convertPoints(hxd.fmt.fbx.FbxTools.getFloats(v1));
			}
		}
	}
	,init: function(n) {
		var _g = n.name;
		switch(_g) {
		case "Connections":
			var _g1 = 0;
			var _g2 = n.childs;
			while(_g1 < _g2.length) {
				var c = _g2[_g1];
				++_g1;
				if(c.name != "C") continue;
				var child = hxd.fmt.fbx.FbxTools.toInt(c.props[1]);
				var parent = hxd.fmt.fbx.FbxTools.toInt(c.props[2]);
				var c1 = this.connect.get(parent);
				if(c1 == null) {
					c1 = [];
					this.connect.set(parent,c1);
				}
				c1.push(child);
				if(parent == 0) continue;
				var c2 = this.invConnect.get(child);
				if(c2 == null) {
					c2 = [];
					this.invConnect.set(child,c2);
				}
				c2.push(parent);
			}
			break;
		case "Objects":
			var _g11 = 0;
			var _g21 = n.childs;
			while(_g11 < _g21.length) {
				var c3 = _g21[_g11];
				++_g11;
				var key = hxd.fmt.fbx.FbxTools.getId(c3);
				this.ids.set(key,c3);
			}
			break;
		default:
		}
	}
	,getGeometry: function(name) {
		if(name == null) name = "";
		var geom = null;
		var _g = 0;
		var _g1 = hxd.fmt.fbx.FbxTools.getAll(this.root,"Objects.Geometry");
		while(_g < _g1.length) {
			var g = _g1[_g];
			++_g;
			if(hxd.fmt.fbx.FbxTools.hasProp(g,hxd.fmt.fbx.FbxProp.PString("Geometry::" + name))) {
				geom = g;
				break;
			}
		}
		if(geom == null) throw "Geometry " + name + " not found";
		return new hxd.fmt.fbx.Geometry(this,geom);
	}
	,getParent: function(node,nodeName,opt) {
		var p = this.getParents(node,nodeName);
		if(p.length > 1) throw hxd.fmt.fbx.FbxTools.getName(node) + " has " + p.length + " " + nodeName + " parents " + ((function($this) {
			var $r;
			var _g = [];
			{
				var _g1 = 0;
				while(_g1 < p.length) {
					var o = p[_g1];
					++_g1;
					_g.push(hxd.fmt.fbx.FbxTools.getName(o));
				}
			}
			$r = _g;
			return $r;
		}(this))).join(",");
		if(p.length == 0 && !opt) throw "Missing " + hxd.fmt.fbx.FbxTools.getName(node) + " " + nodeName + " parent";
		return p[0];
	}
	,getParents: function(node,nodeName) {
		var c;
		var key = hxd.fmt.fbx.FbxTools.getId(node);
		c = this.invConnect.get(key);
		var pl = [];
		if(c != null) {
			var _g = 0;
			while(_g < c.length) {
				var id = c[_g];
				++_g;
				var n = this.ids.get(id);
				if(n == null) throw id + " not found";
				if(nodeName != null && n.name != nodeName) continue;
				pl.push(n);
			}
		}
		return pl;
	}
	,__class__: hxd.fmt.fbx.Library
};
hxd.fmt.fbx._Parser = {};
hxd.fmt.fbx._Parser.Token = $hxClasses["hxd.fmt.fbx._Parser.Token"] = { __ename__ : true, __constructs__ : ["TIdent","TNode","TInt","TFloat","TString","TLength","TBraceOpen","TBraceClose","TColon","TEof"] };
hxd.fmt.fbx._Parser.Token.TIdent = function(s) { var $x = ["TIdent",0,s]; $x.__enum__ = hxd.fmt.fbx._Parser.Token; $x.toString = $estr; return $x; };
hxd.fmt.fbx._Parser.Token.TNode = function(s) { var $x = ["TNode",1,s]; $x.__enum__ = hxd.fmt.fbx._Parser.Token; $x.toString = $estr; return $x; };
hxd.fmt.fbx._Parser.Token.TInt = function(s) { var $x = ["TInt",2,s]; $x.__enum__ = hxd.fmt.fbx._Parser.Token; $x.toString = $estr; return $x; };
hxd.fmt.fbx._Parser.Token.TFloat = function(s) { var $x = ["TFloat",3,s]; $x.__enum__ = hxd.fmt.fbx._Parser.Token; $x.toString = $estr; return $x; };
hxd.fmt.fbx._Parser.Token.TString = function(s) { var $x = ["TString",4,s]; $x.__enum__ = hxd.fmt.fbx._Parser.Token; $x.toString = $estr; return $x; };
hxd.fmt.fbx._Parser.Token.TLength = function(v) { var $x = ["TLength",5,v]; $x.__enum__ = hxd.fmt.fbx._Parser.Token; $x.toString = $estr; return $x; };
hxd.fmt.fbx._Parser.Token.TBraceOpen = ["TBraceOpen",6];
hxd.fmt.fbx._Parser.Token.TBraceOpen.toString = $estr;
hxd.fmt.fbx._Parser.Token.TBraceOpen.__enum__ = hxd.fmt.fbx._Parser.Token;
hxd.fmt.fbx._Parser.Token.TBraceClose = ["TBraceClose",7];
hxd.fmt.fbx._Parser.Token.TBraceClose.toString = $estr;
hxd.fmt.fbx._Parser.Token.TBraceClose.__enum__ = hxd.fmt.fbx._Parser.Token;
hxd.fmt.fbx._Parser.Token.TColon = ["TColon",8];
hxd.fmt.fbx._Parser.Token.TColon.toString = $estr;
hxd.fmt.fbx._Parser.Token.TColon.__enum__ = hxd.fmt.fbx._Parser.Token;
hxd.fmt.fbx._Parser.Token.TEof = ["TEof",9];
hxd.fmt.fbx._Parser.Token.TEof.toString = $estr;
hxd.fmt.fbx._Parser.Token.TEof.__enum__ = hxd.fmt.fbx._Parser.Token;
hxd.fmt.fbx._Parser.Token.__empty_constructs__ = [hxd.fmt.fbx._Parser.Token.TBraceOpen,hxd.fmt.fbx._Parser.Token.TBraceClose,hxd.fmt.fbx._Parser.Token.TColon,hxd.fmt.fbx._Parser.Token.TEof];
hxd.fmt.fbx.Parser = function() {
};
$hxClasses["hxd.fmt.fbx.Parser"] = hxd.fmt.fbx.Parser;
hxd.fmt.fbx.Parser.__name__ = true;
hxd.fmt.fbx.Parser.parse = function(text) {
	return new hxd.fmt.fbx.Parser().parseText(text);
};
hxd.fmt.fbx.Parser.prototype = {
	parseText: function(str) {
		this.buf = str;
		this.pos = 0;
		this.line = 1;
		this.token = null;
		return { name : "Root", props : [hxd.fmt.fbx.FbxProp.PInt(0),hxd.fmt.fbx.FbxProp.PString("Root"),hxd.fmt.fbx.FbxProp.PString("Root")], childs : this.parseNodes()};
	}
	,parseNodes: function() {
		var nodes = [];
		while(true) {
			var _g = this.peek();
			switch(_g[1]) {
			case 9:case 7:
				return nodes;
			default:
			}
			nodes.push(this.parseNode());
		}
		return nodes;
	}
	,parseNode: function() {
		var t = this.next();
		var name;
		switch(t[1]) {
		case 1:
			var n = t[2];
			name = n;
			break;
		default:
			name = this.unexpected(t);
		}
		var props = [];
		var childs = null;
		try {
			while(true) {
				t = this.next();
				switch(t[1]) {
				case 3:
					var s = t[2];
					props.push(hxd.fmt.fbx.FbxProp.PFloat(Std.parseFloat(s)));
					break;
				case 2:
					var s1 = t[2];
					props.push(hxd.fmt.fbx.FbxProp.PInt(Std.parseInt(s1)));
					break;
				case 4:
					var s2 = t[2];
					props.push(hxd.fmt.fbx.FbxProp.PString(s2));
					break;
				case 0:
					var s3 = t[2];
					props.push(hxd.fmt.fbx.FbxProp.PIdent(s3));
					break;
				case 6:case 7:
					this.token = t;
					break;
				case 5:
					var v = t[2];
					this.except(hxd.fmt.fbx._Parser.Token.TBraceOpen);
					this.except(hxd.fmt.fbx._Parser.Token.TNode("a"));
					var ints = [];
					var floats = null;
					var i = 0;
					while(i < v) {
						t = this.next();
						switch(t[1]) {
						case 8:
							continue;
							break;
						case 2:
							var s4 = t[2];
							i++;
							if(floats == null) ints.push(Std.parseInt(s4)); else floats.push(Std.parseInt(s4));
							break;
						case 3:
							var s5 = t[2];
							i++;
							if(floats == null) {
								floats = [];
								var _g = 0;
								while(_g < ints.length) {
									var i1 = ints[_g];
									++_g;
									floats.push(i1);
								}
								ints = null;
							}
							floats.push(Std.parseFloat(s5));
							break;
						default:
							this.unexpected(t);
						}
					}
					props.push(floats == null?hxd.fmt.fbx.FbxProp.PInts(ints):hxd.fmt.fbx.FbxProp.PFloats(floats));
					this.except(hxd.fmt.fbx._Parser.Token.TBraceClose);
					throw "__break__";
					break;
				default:
					this.unexpected(t);
				}
				t = this.next();
				switch(t[1]) {
				case 1:case 7:
					this.token = t;
					throw "__break__";
					break;
				case 8:
					break;
				case 6:
					childs = this.parseNodes();
					this.except(hxd.fmt.fbx._Parser.Token.TBraceClose);
					throw "__break__";
					break;
				default:
					this.unexpected(t);
				}
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		if(childs == null) childs = [];
		return { name : name, props : props, childs : childs};
	}
	,except: function(except) {
		var t = this.next();
		if(!Type.enumEq(t,except)) this.error("Unexpected '" + this.tokenStr(t) + "' (" + this.tokenStr(except) + " expected)");
	}
	,peek: function() {
		if(this.token == null) this.token = this.nextToken();
		return this.token;
	}
	,next: function() {
		if(this.token == null) return this.nextToken();
		var tmp = this.token;
		this.token = null;
		return tmp;
	}
	,error: function(msg) {
		throw msg + " (line " + this.line + ")";
		return null;
	}
	,unexpected: function(t) {
		return this.error("Unexpected " + this.tokenStr(t));
	}
	,tokenStr: function(t) {
		switch(t[1]) {
		case 9:
			return "<eof>";
		case 6:
			return "{";
		case 7:
			return "}";
		case 0:
			var i = t[2];
			return i;
		case 1:
			var i1 = t[2];
			return i1 + ":";
		case 3:
			var f = t[2];
			return f;
		case 2:
			var i2 = t[2];
			return i2;
		case 4:
			var s = t[2];
			return "\"" + s + "\"";
		case 8:
			return ",";
		case 5:
			var l = t[2];
			return "*" + l;
		}
	}
	,nextToken: function() {
		var start = this.pos;
		while(true) {
			var c = StringTools.fastCodeAt(this.buf,this.pos++);
			switch(c) {
			case 32:case 13:case 9:
				start++;
				break;
			case 10:
				this.line++;
				start++;
				break;
			case 59:
				while(true) {
					var c1 = StringTools.fastCodeAt(this.buf,this.pos++);
					if(c1 != c1 || c1 == 10) {
						this.pos--;
						break;
					}
				}
				start = this.pos;
				break;
			case 44:
				return hxd.fmt.fbx._Parser.Token.TColon;
			case 123:
				return hxd.fmt.fbx._Parser.Token.TBraceOpen;
			case 125:
				return hxd.fmt.fbx._Parser.Token.TBraceClose;
			case 34:
				start = this.pos;
				while(true) {
					c = StringTools.fastCodeAt(this.buf,this.pos++);
					if(c == 34) break;
					if(c != c || c == 10) this.error("Unclosed string");
				}
				return hxd.fmt.fbx._Parser.Token.TString(HxOverrides.substr(this.buf,start,this.pos - start - 1));
			case 42:
				start = this.pos;
				do c = StringTools.fastCodeAt(this.buf,this.pos++); while(c >= 48 && c <= 57);
				this.pos--;
				return hxd.fmt.fbx._Parser.Token.TLength(Std.parseInt(HxOverrides.substr(this.buf,start,this.pos - start)));
			default:
				if(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c == 95) {
					do c = StringTools.fastCodeAt(this.buf,this.pos++); while(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 95 || c == 45);
					if(c == 58) return hxd.fmt.fbx._Parser.Token.TNode(HxOverrides.substr(this.buf,start,this.pos - start - 1));
					this.pos--;
					return hxd.fmt.fbx._Parser.Token.TIdent(HxOverrides.substr(this.buf,start,this.pos - start));
				}
				if(c >= 48 && c <= 57 || c == 45) {
					do c = StringTools.fastCodeAt(this.buf,this.pos++); while(c >= 48 && c <= 57);
					if(c != 46 && c != 69 && c != 101 && this.pos - start < 10) {
						this.pos--;
						return hxd.fmt.fbx._Parser.Token.TInt(HxOverrides.substr(this.buf,start,this.pos - start));
					}
					if(c == 46) do c = StringTools.fastCodeAt(this.buf,this.pos++); while(c >= 48 && c <= 57);
					if(c == 101 || c == 69) {
						c = StringTools.fastCodeAt(this.buf,this.pos++);
						if(c != 45 && c != 43) this.pos--;
						do c = StringTools.fastCodeAt(this.buf,this.pos++); while(c >= 48 && c <= 57);
					}
					this.pos--;
					return hxd.fmt.fbx._Parser.Token.TFloat(HxOverrides.substr(this.buf,start,this.pos - start));
				}
				if(c != c) {
					this.pos--;
					return hxd.fmt.fbx._Parser.Token.TEof;
				}
				this.error("Unexpected char '" + String.fromCharCode(c) + "'");
			}
		}
	}
	,__class__: hxd.fmt.fbx.Parser
};
hxd.fmt.fbx.XBXReader = function(i) {
	this.i = i;
};
$hxClasses["hxd.fmt.fbx.XBXReader"] = hxd.fmt.fbx.XBXReader;
hxd.fmt.fbx.XBXReader.__name__ = true;
hxd.fmt.fbx.XBXReader.prototype = {
	error: function(msg) {
		throw "Invalid XBX data" + (null != msg?": " + msg:"");
	}
	,readString: function() {
		var len = this.i.readByte();
		if(len >= 128) len = this.i.readUInt24() << 7 | len & 127;
		return this.i.readString(len);
	}
	,read: function() {
		if(this.i.readString(3) != "XBX") this.error("no XBX sig");
		this.version = this.i.readByte();
		if(this.version > 0) this.error("version err " + this.version);
		return this.readNode();
	}
	,readNode: function() {
		return { name : this.readString(), props : (function($this) {
			var $r;
			var a = [];
			var l = $this.i.readByte();
			a[l - 1] = null;
			{
				var _g = 0;
				while(_g < l) {
					var i = _g++;
					a[i] = $this.readProp();
				}
			}
			$r = a;
			return $r;
		}(this)), childs : (function($this) {
			var $r;
			var a1 = [];
			var l1 = $this.i.readInt24();
			a1[l1 - 1] = null;
			{
				var _g1 = 0;
				while(_g1 < l1) {
					var i1 = _g1++;
					a1[i1] = $this.readNode();
				}
			}
			$r = a1;
			return $r;
		}(this))};
	}
	,readProp: function() {
		var b = this.i.readByte();
		var t;
		switch(b) {
		case 0:
			t = hxd.fmt.fbx.FbxProp.PInt(this.i.readInt32());
			break;
		case 1:
			t = hxd.fmt.fbx.FbxProp.PFloat(this.i.readDouble());
			break;
		case 2:
			t = hxd.fmt.fbx.FbxProp.PString(this.readString());
			break;
		case 3:
			t = hxd.fmt.fbx.FbxProp.PIdent(this.readString());
			break;
		case 4:
			var l = this.i.readInt32();
			var a = [];
			var tmp = hxd.impl.Tmp.getBytes(l * 4);
			this.i.readFullBytes(tmp,0,l * 4);
			var r = hxd.impl.Memory.select(tmp);
			a[l - 1] = 0;
			var _g = 0;
			while(_g < l) {
				var idx = _g++;
				throw "TODO";
				a[idx] = 0;
			}
			hxd.impl.Memory.end();
			hxd.impl.Tmp.saveBytes(tmp);
			t = hxd.fmt.fbx.FbxProp.PInts(a);
			break;
		case 5:
			var l1 = this.i.readInt32();
			var a1 = [];
			var tmp1 = hxd.impl.Tmp.getBytes(l1 * 8);
			this.i.readFullBytes(tmp1,0,l1 * 8);
			var r1 = hxd.impl.Memory.select(tmp1);
			a1[l1 - 1] = 0.;
			var _g1 = 0;
			while(_g1 < l1) {
				var idx1 = _g1++;
				throw "TODO";
				a1[idx1] = 0.;
			}
			hxd.impl.Memory.end();
			hxd.impl.Tmp.saveBytes(tmp1);
			t = hxd.fmt.fbx.FbxProp.PFloats(a1);
			break;
		default:
			this.error("unknown prop " + b);
			t = null;
		}
		return t;
	}
	,__class__: hxd.fmt.fbx.XBXReader
};
hxd.impl = {};
hxd.impl.MemoryReader = function() {
};
$hxClasses["hxd.impl.MemoryReader"] = hxd.impl.MemoryReader;
hxd.impl.MemoryReader.__name__ = true;
hxd.impl.MemoryReader.prototype = {
	__class__: hxd.impl.MemoryReader
};
hxd.impl.Memory = function() { };
$hxClasses["hxd.impl.Memory"] = hxd.impl.Memory;
hxd.impl.Memory.__name__ = true;
hxd.impl.Memory.select = function(b) {
	if(hxd.impl.Memory.current != null) hxd.impl.Memory.stack.push(hxd.impl.Memory.current);
	hxd.impl.Memory.current = b;
	return hxd.impl.Memory.inst;
};
hxd.impl.Memory.end = function() {
	hxd.impl.Memory.current = hxd.impl.Memory.stack.pop();
};
hxd.impl.Tmp = function() { };
$hxClasses["hxd.impl.Tmp"] = hxd.impl.Tmp;
hxd.impl.Tmp.__name__ = true;
hxd.impl.Tmp.getBytes = function(size) {
	var _g1 = 0;
	var _g = hxd.impl.Tmp.bytes.length;
	while(_g1 < _g) {
		var i = _g1++;
		var b = hxd.impl.Tmp.bytes[i];
		if(b.length >= size) {
			hxd.impl.Tmp.bytes.splice(i,1);
			return b;
		}
	}
	var sz = 1024;
	while(sz < size) sz = sz * 3 >> 1;
	return haxe.io.Bytes.alloc(sz);
};
hxd.impl.Tmp.saveBytes = function(b) {
	var _g1 = 0;
	var _g = hxd.impl.Tmp.bytes.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(hxd.impl.Tmp.bytes[i].length <= b.length) {
			hxd.impl.Tmp.bytes.splice(i,0,b);
			if(hxd.impl.Tmp.bytes.length > 8) hxd.impl.Tmp.bytes.pop();
			return;
		}
	}
	hxd.impl.Tmp.bytes.push(b);
};
hxd.res.FileEntry = function() { };
$hxClasses["hxd.res.FileEntry"] = hxd.res.FileEntry;
hxd.res.FileEntry.__name__ = true;
hxd.res.FileEntry.prototype = {
	getSign: function() {
		return 0;
	}
	,getBytes: function() {
		return null;
	}
	,open: function() {
	}
	,skip: function(nbytes) {
	}
	,readByte: function() {
		return 0;
	}
	,read: function(out,pos,size) {
	}
	,close: function() {
	}
	,load: function(onReady) {
	}
	,loadBitmap: function(onLoaded) {
	}
	,watch: function(onChanged) {
	}
	,get_isAvailable: function() {
		return true;
	}
	,get_path: function() {
		return this.name;
	}
	,get_extension: function() {
		var np = this.name.split(".");
		if(np.length == 1) return ""; else return np.pop().toLowerCase();
	}
	,__class__: hxd.res.FileEntry
	,__properties__: {get_extension:"get_extension",get_path:"get_path",get_isAvailable:"get_isAvailable"}
};
hxd.res._EmbedFileSystem = {};
hxd.res._EmbedFileSystem.EmbedEntry = function(fs,name,relPath,data) {
	this.fs = fs;
	this.name = name;
	this.relPath = relPath;
	this.data = data;
};
$hxClasses["hxd.res._EmbedFileSystem.EmbedEntry"] = hxd.res._EmbedFileSystem.EmbedEntry;
hxd.res._EmbedFileSystem.EmbedEntry.__name__ = true;
hxd.res._EmbedFileSystem.EmbedEntry.__super__ = hxd.res.FileEntry;
hxd.res._EmbedFileSystem.EmbedEntry.prototype = $extend(hxd.res.FileEntry.prototype,{
	getSign: function() {
		var old = this.readPos;
		this.open();
		this.readPos = old;
		return this.bytes.b[0] | this.bytes.b[1] << 8 | this.bytes.b[2] << 16 | this.bytes.b[3] << 24;
	}
	,getBytes: function() {
		if(this.bytes == null) this.open();
		return this.bytes;
	}
	,open: function() {
		if(this.bytes == null) {
			this.bytes = haxe.Resource.getBytes(this.data);
			if(this.bytes == null) throw "Missing resource " + this.data;
		}
		this.readPos = 0;
	}
	,skip: function(nbytes) {
		this.readPos += nbytes;
	}
	,readByte: function() {
		return this.bytes.get(this.readPos++);
	}
	,read: function(out,pos,size) {
		out.blit(pos,this.bytes,this.readPos,size);
		this.readPos += size;
	}
	,close: function() {
		this.bytes = null;
		this.readPos = 0;
	}
	,load: function(onReady) {
		if(onReady != null) haxe.Timer.delay(onReady,1);
	}
	,loadBitmap: function(onLoaded) {
		var rawData = null;
		var _g = 0;
		var _g1 = haxe.Resource.content;
		while(_g < _g1.length) {
			var res = _g1[_g];
			++_g;
			if(res.name == this.data) {
				rawData = res.data;
				break;
			}
		}
		if(rawData == null) throw "Missing resource " + this.data;
		var image = new Image();
		image.onload = function(_) {
			onLoaded(image);
		};
		var extra = "";
		var bytes = rawData.length * 6 >> 3;
		var _g11 = 0;
		var _g2 = (3 - bytes * 4 % 3) % 3;
		while(_g11 < _g2) {
			var i = _g11++;
			extra += "=";
		}
		image.src = "data:image/" + this.get_extension() + ";base64," + rawData + extra;
	}
	,get_path: function() {
		if(this.relPath == ".") return "<root>"; else return this.relPath;
	}
	,__class__: hxd.res._EmbedFileSystem.EmbedEntry
});
hxd.res.EmbedFileSystem = function(root) {
	this.root = root;
};
$hxClasses["hxd.res.EmbedFileSystem"] = hxd.res.EmbedFileSystem;
hxd.res.EmbedFileSystem.__name__ = true;
hxd.res.EmbedFileSystem.__interfaces__ = [hxd.res.FileSystem];
hxd.res.EmbedFileSystem.resolve = function(path) {
	return "R_" + hxd.res.EmbedFileSystem.invalidChars.replace(path,"_");
};
hxd.res.EmbedFileSystem.prototype = {
	splitPath: function(path) {
		if(path == ".") return []; else return path.split("/");
	}
	,exists: function(path) {
		var r = this.root;
		var _g = 0;
		var _g1 = this.splitPath(path);
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			r = Reflect.field(r,p);
			if(r == null) return false;
		}
		return true;
	}
	,get: function(path) {
		if(!this.exists(path)) throw new hxd.res.NotFound(path);
		var id = hxd.res.EmbedFileSystem.resolve(path);
		return new hxd.res._EmbedFileSystem.EmbedEntry(this,path.split("/").pop(),path,id);
	}
	,__class__: hxd.res.EmbedFileSystem
};
hxd.res.FbxModel = function(entry) {
	hxd.res.Resource.call(this,entry);
};
$hxClasses["hxd.res.FbxModel"] = hxd.res.FbxModel;
hxd.res.FbxModel.__name__ = true;
hxd.res.FbxModel.__super__ = hxd.res.Resource;
hxd.res.FbxModel.prototype = $extend(hxd.res.Resource.prototype,{
	toFbx: function(loader) {
		var lib = new hxd.fmt.fbx.Library();
		var _g = this.entry.getSign() & 255;
		switch(_g) {
		case 59:
			lib.load(hxd.fmt.fbx.Parser.parse(this.entry.getBytes().toString()));
			break;
		case 88:
			var f = new haxe.io.BytesInput(this.entry.getBytes());
			var xbx = new hxd.fmt.fbx.XBXReader(f).read();
			lib.load(xbx);
			f.close();
			break;
		case 60:
			if(loader == null) throw "Loader parameter required for XTRA";
			lib = loader.load((function($this) {
				var $r;
				var _this = $this.entry.get_path();
				$r = HxOverrides.substr(_this,0,-4);
				return $r;
			}(this)) + "FBX").toFbx();
			lib.loadXtra(this.entry.getBytes().toString());
			break;
		default:
			throw "Unsupported model format " + this.entry.get_path();
		}
		if(hxd.res.FbxModel.isLeftHanded) lib.leftHandConvert();
		return lib;
	}
	,__class__: hxd.res.FbxModel
});
hxd.res.FileInput = function(f) {
	this.f = f;
	f.open();
};
$hxClasses["hxd.res.FileInput"] = hxd.res.FileInput;
hxd.res.FileInput.__name__ = true;
hxd.res.FileInput.__super__ = haxe.io.Input;
hxd.res.FileInput.prototype = $extend(haxe.io.Input.prototype,{
	skip: function(nbytes) {
		this.f.skip(nbytes);
	}
	,readByte: function() {
		return this.f.readByte();
	}
	,readBytes: function(b,pos,len) {
		this.f.read(b,pos,len);
		return len;
	}
	,close: function() {
		this.f.close();
	}
	,__class__: hxd.res.FileInput
});
hxd.res.Image = function(entry) {
	hxd.res.Resource.call(this,entry);
};
$hxClasses["hxd.res.Image"] = hxd.res.Image;
hxd.res.Image.__name__ = true;
hxd.res.Image.__super__ = hxd.res.Resource;
hxd.res.Image.prototype = $extend(hxd.res.Resource.prototype,{
	getSize: function() {
		if(this.inf != null) return this.inf;
		var f = new hxd.res.FileInput(this.entry);
		var width = 0;
		var height = 0;
		var isPNG = false;
		var _g = f.readUInt16();
		switch(_g) {
		case 55551:
			f.set_bigEndian(true);
			try {
				while(true) {
					var _g1 = f.readUInt16();
					switch(_g1) {
					case 65474:case 65472:
						var len = f.readUInt16();
						var prec = f.readByte();
						height = f.readUInt16();
						width = f.readUInt16();
						throw "__break__";
						break;
					default:
						f.skip(f.readUInt16() - 2);
					}
				}
			} catch( e ) { if( e != "__break__" ) throw e; }
			break;
		case 20617:
			isPNG = true;
			var TMP = hxd.impl.Tmp.getBytes(256);
			f.set_bigEndian(true);
			f.readBytes(TMP,0,6);
			while(true) {
				var dataLen = f.readInt32();
				if(f.readInt32() == 1229472850) {
					width = f.readInt32();
					height = f.readInt32();
					break;
				}
				while(dataLen > 0) {
					var k;
					if(dataLen > TMP.length) k = TMP.length; else k = dataLen;
					f.readBytes(TMP,0,k);
					dataLen -= k;
				}
				var crc = f.readInt32();
			}
			hxd.impl.Tmp.saveBytes(TMP);
			break;
		default:
			throw "Unsupported texture format " + this.entry.get_path();
		}
		f.close();
		this.inf = { width : width, height : height, isPNG : isPNG};
		return this.inf;
	}
	,getPixels: function() {
		this.getSize();
		if(this.inf.isPNG) {
			var png = new format.png.Reader(new haxe.io.BytesInput(this.entry.getBytes()));
			png.checkCRC = false;
			var pixels = hxd.Pixels.alloc(this.inf.width,this.inf.height,hxd.PixelFormat.BGRA);
			format.png.Tools.extract32(png.read(),pixels.bytes);
			return pixels;
		} else {
			var bytes = this.entry.getBytes();
			var p = hxd.res.NanoJpeg.decode(bytes);
			return new hxd.Pixels(p.width,p.height,p.pixels,hxd.PixelFormat.BGRA);
		}
	}
	,toBitmap: function() {
		this.getSize();
		var bmp;
		var this1;
		var canvas;
		var _this = window.document;
		canvas = _this.createElement("canvas");
		canvas.width = this.inf.width;
		canvas.height = this.inf.height;
		this1 = canvas.getContext("2d");
		bmp = this1;
		var pixels = this.getPixels();
		hxd._BitmapData.BitmapData_Impl_.nativeSetPixels(bmp,pixels);
		pixels.dispose();
		return bmp;
	}
	,watchCallb: function() {
		var w = this.inf.width;
		var h = this.inf.height;
		this.inf = null;
		var s = this.getSize();
		if(w != s.width || h != s.height) this.tex.resize(w,h);
		this.tex.realloc = null;
		this.loadTexture();
	}
	,loadTexture: function() {
		var _g = this;
		if(this.inf.isPNG) {
			var load = function() {
				_g.tex.alloc();
				var pixels = _g.getPixels();
				if(pixels.width != _g.tex.width || pixels.height != _g.tex.height) pixels.makeSquare();
				_g.tex.uploadPixels(pixels);
				pixels.dispose();
				_g.tex.realloc = $bind(_g,_g.loadTexture);
				_g.watch($bind(_g,_g.watchCallb));
			};
			if(this.entry.get_isAvailable()) load(); else this.entry.load(load);
		} else this.entry.loadBitmap(function(bmp) {
			var bmp1 = hxd.res._LoadedBitmap.LoadedBitmap_Impl_.toBitmap(bmp);
			_g.tex.alloc();
			if(bmp1.canvas.width != _g.tex.width || bmp1.canvas.height != _g.tex.height) {
				var pixels1 = hxd._BitmapData.BitmapData_Impl_.nativeGetPixels(bmp1);
				pixels1.makeSquare();
				_g.tex.uploadPixels(pixels1);
				pixels1.dispose();
			} else _g.tex.uploadBitmap(bmp1);
			_g.tex.realloc = $bind(_g,_g.loadTexture);
			_g.watch($bind(_g,_g.watchCallb));
		});
	}
	,toTexture: function() {
		if(this.tex != null) return this.tex;
		this.getSize();
		var width = this.inf.width;
		var height = this.inf.height;
		if(!hxd.res.Image.ALLOW_NPOT) {
			var tw = 1;
			var th = 1;
			while(tw < width) tw <<= 1;
			while(th < height) th <<= 1;
			width = tw;
			height = th;
		}
		this.tex = new h3d.mat.Texture(width,height,[h3d.mat.TextureFlags.NoAlloc]);
		if(hxd.res.Image.DEFAULT_FILTER != h3d.mat.Filter.Linear) this.tex.set_filter(hxd.res.Image.DEFAULT_FILTER);
		this.tex.setName(this.entry.get_path());
		this.loadTexture();
		return this.tex;
	}
	,__class__: hxd.res.Image
});
hxd.res._LoadedBitmap = {};
hxd.res._LoadedBitmap.LoadedBitmap_Impl_ = function() { };
$hxClasses["hxd.res._LoadedBitmap.LoadedBitmap_Impl_"] = hxd.res._LoadedBitmap.LoadedBitmap_Impl_;
hxd.res._LoadedBitmap.LoadedBitmap_Impl_.__name__ = true;
hxd.res._LoadedBitmap.LoadedBitmap_Impl_.toBitmap = function(this1) {
	var canvas;
	var _this = window.document;
	canvas = _this.createElement("canvas");
	canvas.width = this1.width;
	canvas.height = this1.height;
	var ctx = canvas.getContext("2d");
	ctx.drawImage(this1,0,0);
	return ctx;
};
hxd.res.Filter = $hxClasses["hxd.res.Filter"] = { __ename__ : true, __constructs__ : ["Fast","Chromatic"] };
hxd.res.Filter.Fast = ["Fast",0];
hxd.res.Filter.Fast.toString = $estr;
hxd.res.Filter.Fast.__enum__ = hxd.res.Filter;
hxd.res.Filter.Chromatic = ["Chromatic",1];
hxd.res.Filter.Chromatic.toString = $estr;
hxd.res.Filter.Chromatic.__enum__ = hxd.res.Filter;
hxd.res.Filter.__empty_constructs__ = [hxd.res.Filter.Fast,hxd.res.Filter.Chromatic];
hxd.res._NanoJpeg = {};
hxd.res._NanoJpeg.Component = function() {
};
$hxClasses["hxd.res._NanoJpeg.Component"] = hxd.res._NanoJpeg.Component;
hxd.res._NanoJpeg.Component.__name__ = true;
hxd.res._NanoJpeg.Component.prototype = {
	__class__: hxd.res._NanoJpeg.Component
};
hxd.res.NanoJpeg = function() {
	var array = [new hxd.res._NanoJpeg.Component(),new hxd.res._NanoJpeg.Component(),new hxd.res._NanoJpeg.Component()];
	var vec;
	var this1;
	this1 = new Array(array.length);
	vec = this1;
	var _g1 = 0;
	var _g = array.length;
	while(_g1 < _g) {
		var i = _g1++;
		vec[i] = array[i];
	}
	this.comps = vec;
	var array1 = [(function($this) {
		var $r;
		var this2;
		this2 = new Array(64);
		$r = this2;
		return $r;
	}(this)),(function($this) {
		var $r;
		var this3;
		this3 = new Array(64);
		$r = this3;
		return $r;
	}(this)),(function($this) {
		var $r;
		var this4;
		this4 = new Array(64);
		$r = this4;
		return $r;
	}(this)),(function($this) {
		var $r;
		var this5;
		this5 = new Array(64);
		$r = this5;
		return $r;
	}(this))];
	var vec1;
	var this6;
	this6 = new Array(array1.length);
	vec1 = this6;
	var _g11 = 0;
	var _g2 = array1.length;
	while(_g11 < _g2) {
		var i1 = _g11++;
		vec1[i1] = array1[i1];
	}
	this.qtab = vec1;
	var this7;
	this7 = new Array(16);
	this.counts = this7;
	var this8;
	this8 = new Array(64);
	this.block = this8;
	var array2 = [0,1,8,16,9,2,3,10,17,24,32,25,18,11,4,5,12,19,26,33,40,48,41,34,27,20,13,6,7,14,21,28,35,42,49,56,57,50,43,36,29,22,15,23,30,37,44,51,58,59,52,45,38,31,39,46,53,60,61,54,47,55,62,63];
	var vec2;
	var this9;
	this9 = new Array(array2.length);
	vec2 = this9;
	var _g12 = 0;
	var _g3 = array2.length;
	while(_g12 < _g3) {
		var i2 = _g12++;
		vec2[i2] = array2[i2];
	}
	this.njZZ = vec2;
	var array3 = [null,null,null,null];
	var vec3;
	var this10;
	this10 = new Array(array3.length);
	vec3 = this10;
	var _g13 = 0;
	var _g4 = array3.length;
	while(_g13 < _g4) {
		var i3 = _g13++;
		vec3[i3] = array3[i3];
	}
	this.vlctab = vec3;
};
$hxClasses["hxd.res.NanoJpeg"] = hxd.res.NanoJpeg;
hxd.res.NanoJpeg.__name__ = true;
hxd.res.NanoJpeg.njClip = function(x) {
	if(x < 0) return 0; else if(x > 255) return 255; else return x;
};
hxd.res.NanoJpeg.decode = function(bytes,filter,position,size) {
	if(size == null) size = -1;
	if(position == null) position = 0;
	if(hxd.res.NanoJpeg.inst == null) hxd.res.NanoJpeg.inst = new hxd.res.NanoJpeg();
	hxd.res.NanoJpeg.inst.njInit(bytes,position,size,filter);
	return hxd.res.NanoJpeg.inst.njDecode();
};
hxd.res.NanoJpeg.prototype = {
	njInit: function(bytes,pos,size,filter) {
		this.bytes = bytes;
		this.pos = pos;
		if(filter == null) this.filter = hxd.res.Filter.Chromatic; else this.filter = filter;
		if(size < 0) size = bytes.length - pos;
		var _g = 0;
		while(_g < 4) {
			var i = _g++;
			if(this.vlctab[i] == null) {
				var val = hxd.impl.Tmp.getBytes(131072);
				this.vlctab[i] = val;
			}
		}
		this.size = size;
		this.qtused = 0;
		this.qtavail = 0;
		this.rstinterval = 0;
		this.buf = 0;
		this.bufbits = 0;
		var _g1 = 0;
		while(_g1 < 3) {
			var i1 = _g1++;
			this.comps[i1].dcpred = 0;
		}
	}
	,cleanup: function() {
		this.bytes = null;
		var _g = 0;
		var _g1 = this.comps;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			if(c.pixels != null) {
				hxd.impl.Tmp.saveBytes(c.pixels);
				c.pixels = null;
			}
		}
		var _g2 = 0;
		while(_g2 < 4) {
			var i = _g2++;
			if(this.vlctab[i] != null) {
				hxd.impl.Tmp.saveBytes(this.vlctab[i]);
				this.vlctab[i] = null;
			}
		}
	}
	,njSkip: function(count) {
		this.pos += count;
		this.size -= count;
		this.length -= count;
		null;
	}
	,njShowBits: function(bits) {
		if(bits == 0) return 0;
		while(this.bufbits < bits) {
			if(this.size <= 0) {
				this.buf = this.buf << 8 | 255;
				this.bufbits += 8;
				continue;
			}
			var newbyte = this.bytes.b[this.pos];
			this.pos++;
			this.size--;
			this.bufbits += 8;
			this.buf = this.buf << 8 | newbyte;
			if(newbyte == 255) {
				var marker = this.bytes.b[this.pos];
				this.pos++;
				this.size--;
				switch(marker) {
				case 0:case 255:
					break;
				case 217:
					this.size = 0;
					break;
				default:
					this.buf = this.buf << 8 | marker;
					this.bufbits += 8;
				}
			}
		}
		return this.buf >> this.bufbits - bits & (1 << bits) - 1;
	}
	,njGetBits: function(bits) {
		var r = this.njShowBits(bits);
		this.bufbits -= bits;
		return r;
	}
	,njDecodeSOF: function() {
		this.length = this.bytes.b[this.pos] << 8 | this.bytes.b[this.pos + 1];
		this.pos += 2;
		this.size -= 2;
		this.length -= 2;
		null;
		if(this.bytes.b[this.pos] != 8) this.notSupported();
		this.height = this.bytes.b[this.pos + 1] << 8 | this.bytes.b[this.pos + 2];
		this.width = this.bytes.b[this.pos + 3] << 8 | this.bytes.b[this.pos + 4];
		this.ncomp = this.bytes.b[this.pos + 5];
		this.pos += 6;
		this.size -= 6;
		this.length -= 6;
		null;
		var _g = this.ncomp;
		switch(_g) {
		case 1:case 3:
			break;
		default:
			this.notSupported();
		}
		var ssxmax = 0;
		var ssymax = 0;
		var _g1 = 0;
		var _g2 = this.ncomp;
		while(_g1 < _g2) {
			var i = _g1++;
			var c = this.comps[i];
			c.cid = this.bytes.b[this.pos];
			c.ssx = this.bytes.b[this.pos + 1] >> 4;
			if((c.ssx & c.ssx - 1) != 0) this.notSupported();
			c.ssy = this.bytes.b[this.pos + 1] & 15;
			if((c.ssy & c.ssy - 1) != 0) this.notSupported();
			c.qtsel = this.bytes.b[this.pos + 2];
			this.pos += 3;
			this.size -= 3;
			this.length -= 3;
			null;
			this.qtused |= 1 << c.qtsel;
			if(c.ssx > ssxmax) ssxmax = c.ssx;
			if(c.ssy > ssymax) ssymax = c.ssy;
		}
		if(this.ncomp == 1) {
			var c1 = this.comps[0];
			c1.ssx = c1.ssy = ssxmax = ssymax = 1;
		}
		this.mbsizex = ssxmax << 3;
		this.mbsizey = ssymax << 3;
		this.mbwidth = (this.width + this.mbsizex - 1) / this.mbsizex | 0;
		this.mbheight = (this.height + this.mbsizey - 1) / this.mbsizey | 0;
		var _g11 = 0;
		var _g3 = this.ncomp;
		while(_g11 < _g3) {
			var i1 = _g11++;
			var c2 = this.comps[i1];
			c2.width = (this.width * c2.ssx + ssxmax - 1) / ssxmax | 0;
			c2.stride = c2.width + 7 & 2147483640;
			c2.height = (this.height * c2.ssy + ssymax - 1) / ssymax | 0;
			c2.stride = this.mbwidth * this.mbsizex * c2.ssx / ssxmax | 0;
			if(c2.width < 3 && c2.ssx != ssxmax || c2.height < 3 && c2.ssy != ssymax) this.notSupported();
			c2.pixels = hxd.impl.Tmp.getBytes(c2.stride * (this.mbheight * this.mbsizey * c2.ssy / ssymax | 0));
		}
		this.njSkip(this.length);
	}
	,njDecodeDQT: function() {
		this.length = this.bytes.b[this.pos] << 8 | this.bytes.b[this.pos + 1];
		this.pos += 2;
		this.size -= 2;
		this.length -= 2;
		null;
		while(this.length >= 65) {
			var i = this.bytes.b[this.pos];
			this.qtavail |= 1 << i;
			var t = this.qtab[i];
			var _g = 0;
			while(_g < 64) {
				var k = _g++;
				t[k] = this.bytes.b[this.pos + (k + 1)];
			}
			this.pos += 65;
			this.size -= 65;
			this.length -= 65;
			null;
		}
		null;
	}
	,njDecodeDHT: function() {
		this.length = this.bytes.b[this.pos] << 8 | this.bytes.b[this.pos + 1];
		this.pos += 2;
		this.size -= 2;
		this.length -= 2;
		null;
		while(this.length >= 17) {
			var i = this.bytes.b[this.pos];
			if((i & 2) != 0) this.notSupported();
			i = (i | i >> 3) & 3;
			var _g = 0;
			while(_g < 16) {
				var codelen = _g++;
				this.counts[codelen] = this.bytes.b[this.pos + (codelen + 1)];
			}
			this.pos += 17;
			this.size -= 17;
			this.length -= 17;
			null;
			var vlc = this.vlctab[i];
			var vpos = 0;
			var remain = 65536;
			var spread = 65536;
			var _g1 = 1;
			while(_g1 < 17) {
				var codelen1 = _g1++;
				spread >>= 1;
				var currcnt = this.counts[codelen1 - 1];
				if(currcnt == 0) continue;
				remain -= currcnt << 16 - codelen1;
				var _g11 = 0;
				while(_g11 < currcnt) {
					var i1 = _g11++;
					var code = this.bytes.b[this.pos + i1];
					var _g2 = 0;
					while(_g2 < spread) {
						var j = _g2++;
						vlc.set(vpos++,codelen1);
						vlc.set(vpos++,code);
					}
				}
				this.pos += currcnt;
				this.size -= currcnt;
				this.length -= currcnt;
				null;
			}
			while(remain-- != 0) {
				vlc.b[vpos] = 0;
				vpos += 2;
			}
		}
		null;
	}
	,njDecodeDRI: function() {
		this.length = this.bytes.b[this.pos] << 8 | this.bytes.b[this.pos + 1];
		this.pos += 2;
		this.size -= 2;
		this.length -= 2;
		null;
		this.rstinterval = this.bytes.b[this.pos] << 8 | this.bytes.b[this.pos + 1];
		this.njSkip(this.length);
	}
	,njGetVLC: function(vlc) {
		var value = this.njShowBits(16);
		var bits = vlc.b[value << 1];
		if(this.bufbits < bits) this.njShowBits(bits);
		this.bufbits -= bits;
		value = vlc.b[value << 1 | 1];
		this.vlcCode = value;
		bits = value & 15;
		if(bits == 0) return 0;
		value = this.njGetBits(bits);
		if(value < 1 << bits - 1) value += (-1 << bits) + 1;
		return value;
	}
	,njRowIDCT: function(bp) {
		var x0;
		var x1;
		var x2;
		var x3;
		var x4;
		var x5;
		var x6;
		var x7;
		var x8;
		if(((x1 = this.block[bp + 4] << 11) | (x2 = this.block[bp + 6]) | (x3 = this.block[bp + 2]) | (x4 = this.block[bp + 1]) | (x5 = this.block[bp + 7]) | (x6 = this.block[bp + 5]) | (x7 = this.block[bp + 3])) == 0) {
			var val;
			var val1;
			var val2;
			var val3;
			var val4;
			var val5;
			var val6 = this.block[bp + 7] = this.block[bp] << 3;
			val5 = this.block[bp + 6] = val6;
			val4 = this.block[bp + 5] = val5;
			val3 = this.block[bp + 4] = val4;
			val2 = this.block[bp + 3] = val3;
			val1 = this.block[bp + 2] = val2;
			val = this.block[bp + 1] = val1;
			this.block[bp] = val;
			return;
		}
		x0 = (this.block[bp] << 11) + 128;
		x8 = 565 * (x4 + x5);
		x4 = x8 + 2276 * x4;
		x5 = x8 - 3406 * x5;
		x8 = 2408 * (x6 + x7);
		x6 = x8 - 799 * x6;
		x7 = x8 - 4017 * x7;
		x8 = x0 + x1;
		x0 -= x1;
		x1 = 1108 * (x3 + x2);
		x2 = x1 - 3784 * x2;
		x3 = x1 + 1568 * x3;
		x1 = x4 + x6;
		x4 -= x6;
		x6 = x5 + x7;
		x5 -= x7;
		x7 = x8 + x3;
		x8 -= x3;
		x3 = x0 + x2;
		x0 -= x2;
		x2 = 181 * (x4 + x5) + 128 >> 8;
		x4 = 181 * (x4 - x5) + 128 >> 8;
		this.block[bp] = x7 + x1 >> 8;
		this.block[bp + 1] = x3 + x2 >> 8;
		this.block[bp + 2] = x0 + x4 >> 8;
		this.block[bp + 3] = x8 + x6 >> 8;
		this.block[bp + 4] = x8 - x6 >> 8;
		this.block[bp + 5] = x0 - x4 >> 8;
		this.block[bp + 6] = x3 - x2 >> 8;
		this.block[bp + 7] = x7 - x1 >> 8;
	}
	,njColIDCT: function(bp,out,po,stride) {
		var x0;
		var x1;
		var x2;
		var x3;
		var x4;
		var x5;
		var x6;
		var x7;
		var x8;
		if(((x1 = this.block[bp + 32] << 8) | (x2 = this.block[bp + 48]) | (x3 = this.block[bp + 16]) | (x4 = this.block[bp + 8]) | (x5 = this.block[bp + 56]) | (x6 = this.block[bp + 40]) | (x7 = this.block[bp + 24])) == 0) {
			x1 = hxd.res.NanoJpeg.njClip((this.block[bp] + 32 >> 6) + 128);
			var _g = 0;
			while(_g < 8) {
				var i = _g++;
				out.b[po] = x1 & 255;
				po += stride;
			}
			return;
		}
		x0 = (this.block[bp] << 8) + 8192;
		x8 = 565 * (x4 + x5) + 4;
		x4 = x8 + 2276 * x4 >> 3;
		x5 = x8 - 3406 * x5 >> 3;
		x8 = 2408 * (x6 + x7) + 4;
		x6 = x8 - 799 * x6 >> 3;
		x7 = x8 - 4017 * x7 >> 3;
		x8 = x0 + x1;
		x0 -= x1;
		x1 = 1108 * (x3 + x2) + 4;
		x2 = x1 - 3784 * x2 >> 3;
		x3 = x1 + 1568 * x3 >> 3;
		x1 = x4 + x6;
		x4 -= x6;
		x6 = x5 + x7;
		x5 -= x7;
		x7 = x8 + x3;
		x8 -= x3;
		x3 = x0 + x2;
		x0 -= x2;
		x2 = 181 * (x4 + x5) + 128 >> 8;
		x4 = 181 * (x4 - x5) + 128 >> 8;
		var v = hxd.res.NanoJpeg.njClip((x7 + x1 >> 14) + 128);
		out.b[po] = v & 255;
		po += stride;
		var v1 = hxd.res.NanoJpeg.njClip((x3 + x2 >> 14) + 128);
		out.b[po] = v1 & 255;
		po += stride;
		var v2 = hxd.res.NanoJpeg.njClip((x0 + x4 >> 14) + 128);
		out.b[po] = v2 & 255;
		po += stride;
		var v3 = hxd.res.NanoJpeg.njClip((x8 + x6 >> 14) + 128);
		out.b[po] = v3 & 255;
		po += stride;
		var v4 = hxd.res.NanoJpeg.njClip((x8 - x6 >> 14) + 128);
		out.b[po] = v4 & 255;
		po += stride;
		var v5 = hxd.res.NanoJpeg.njClip((x0 - x4 >> 14) + 128);
		out.b[po] = v5 & 255;
		po += stride;
		var v6 = hxd.res.NanoJpeg.njClip((x3 - x2 >> 14) + 128);
		out.b[po] = v6 & 255;
		po += stride;
		var v7 = hxd.res.NanoJpeg.njClip((x7 - x1 >> 14) + 128);
		out.b[po] = v7 & 255;
	}
	,njDecodeBlock: function(c,po) {
		var out = c.pixels;
		var value;
		var coef = 0;
		var _g = 0;
		while(_g < 64) {
			var i = _g++;
			this.block[i] = 0;
		}
		c.dcpred += this.njGetVLC(this.vlctab[c.dctabsel]);
		var qt = this.qtab[c.qtsel];
		var at = this.vlctab[c.actabsel];
		this.block[0] = c.dcpred * qt[0];
		do {
			value = this.njGetVLC(at);
			if(this.vlcCode == 0) break;
			coef += (this.vlcCode >> 4) + 1;
			this.block[this.njZZ[coef]] = value * qt[coef];
		} while(coef < 63);
		var _g1 = 0;
		while(_g1 < 8) {
			var coef1 = _g1++;
			this.njRowIDCT(coef1 * 8);
		}
		var _g2 = 0;
		while(_g2 < 8) {
			var coef2 = _g2++;
			this.njColIDCT(coef2,out,coef2 + po,c.stride);
		}
	}
	,notSupported: function() {
		throw "This JPG file is not supported";
	}
	,njDecodeScan: function() {
		this.length = this.bytes.b[this.pos] << 8 | this.bytes.b[this.pos + 1];
		this.pos += 2;
		this.size -= 2;
		this.length -= 2;
		null;
		if(this.bytes.b[this.pos] != this.ncomp) this.notSupported();
		this.pos += 1;
		this.size -= 1;
		this.length -= 1;
		null;
		var _g1 = 0;
		var _g = this.ncomp;
		while(_g1 < _g) {
			var i = _g1++;
			var c = this.comps[i];
			c.dctabsel = this.bytes.b[this.pos + 1] >> 4;
			c.actabsel = this.bytes.b[this.pos + 1] & 1 | 2;
			this.pos += 2;
			this.size -= 2;
			this.length -= 2;
			null;
		}
		if(this.bytes.b[this.pos] != 0 || this.bytes.b[this.pos + 1] != 63 || this.bytes.b[this.pos + 2] != 0) this.notSupported();
		this.njSkip(this.length);
		var mbx = 0;
		var mby = 0;
		var rstcount = this.rstinterval;
		var nextrst = 0;
		while(true) {
			var _g11 = 0;
			var _g2 = this.ncomp;
			while(_g11 < _g2) {
				var i1 = _g11++;
				var c1 = this.comps[i1];
				var _g3 = 0;
				var _g21 = c1.ssy;
				while(_g3 < _g21) {
					var sby = _g3++;
					var _g5 = 0;
					var _g4 = c1.ssx;
					while(_g5 < _g4) {
						var sbx = _g5++;
						this.njDecodeBlock(c1,(mby * c1.ssy + sby) * c1.stride + mbx * c1.ssx + sbx << 3);
					}
				}
			}
			if(++mbx >= this.mbwidth) {
				mbx = 0;
				if(++mby >= this.mbheight) break;
			}
			if(this.rstinterval != 0 && --rstcount == 0) {
				this.bufbits &= 248;
				var i2 = this.njGetBits(16);
				nextrst = nextrst + 1 & 7;
				rstcount = this.rstinterval;
				var _g6 = 0;
				while(_g6 < 3) {
					var i3 = _g6++;
					this.comps[i3].dcpred = 0;
				}
			}
		}
	}
	,njUpsampleH: function(c) {
		var xmax = c.width - 3;
		var cout = hxd.impl.Tmp.getBytes(c.width * c.height << 1);
		var lout = cout;
		var lin = c.pixels;
		var pi = 0;
		var po = 0;
		var _g1 = 0;
		var _g = c.height;
		while(_g1 < _g) {
			var y = _g1++;
			var v = hxd.res.NanoJpeg.njClip(139 * lin.b[pi] + -11 * lin.b[pi + 1] + 64 >> 7);
			lout.b[po] = v & 255;
			var v1 = hxd.res.NanoJpeg.njClip(104 * lin.b[pi] + 27 * lin.b[pi + 1] + -3 * lin.b[pi + 2] + 64 >> 7);
			lout.b[po + 1] = v1 & 255;
			var v2 = hxd.res.NanoJpeg.njClip(28 * lin.b[pi] + 109 * lin.b[pi + 1] + -9 * lin.b[pi + 2] + 64 >> 7);
			lout.b[po + 2] = v2 & 255;
			var _g2 = 0;
			while(_g2 < xmax) {
				var x = _g2++;
				var v3 = hxd.res.NanoJpeg.njClip(-9 * lin.b[pi + x] + 111 * lin.b[pi + x + 1] + 29 * lin.b[pi + x + 2] + -3 * lin.b[pi + x + 3] + 64 >> 7);
				lout.b[po + (x << 1) + 3] = v3 & 255;
				var v4 = hxd.res.NanoJpeg.njClip(-3 * lin.b[pi + x] + 29 * lin.b[pi + x + 1] + 111 * lin.b[pi + x + 2] + -9 * lin.b[pi + x + 3] + 64 >> 7);
				lout.b[po + (x << 1) + 4] = v4 & 255;
			}
			pi += c.stride;
			po += c.width << 1;
			var v5 = hxd.res.NanoJpeg.njClip(28 * lin.b[pi - 1] + 109 * lin.b[pi - 2] + -9 * lin.b[pi - 3] + 64 >> 7);
			lout.b[po - 3] = v5 & 255;
			var v6 = hxd.res.NanoJpeg.njClip(104 * lin.b[pi - 1] + 27 * lin.b[pi - 2] + -3 * lin.b[pi - 3] + 64 >> 7);
			lout.b[po - 2] = v6 & 255;
			var v7 = hxd.res.NanoJpeg.njClip(139 * lin.b[pi - 1] + -11 * lin.b[pi - 2] + 64 >> 7);
			lout.b[po - 1] = v7 & 255;
		}
		c.width <<= 1;
		c.stride = c.width;
		hxd.impl.Tmp.saveBytes(c.pixels);
		c.pixels = cout;
	}
	,njUpsampleV: function(c) {
		var w = c.width;
		var s1 = c.stride;
		var s2 = s1 + s1;
		var out = hxd.impl.Tmp.getBytes(c.width * c.height << 1);
		var pi = 0;
		var po = 0;
		var cout = out;
		var cin = c.pixels;
		var _g = 0;
		while(_g < w) {
			var x = _g++;
			pi = po = x;
			var v = hxd.res.NanoJpeg.njClip(139 * cin.b[pi] + -11 * cin.b[pi + s1] + 64 >> 7);
			cout.b[po] = v & 255;
			po += w;
			var v1 = hxd.res.NanoJpeg.njClip(104 * cin.b[pi] + 27 * cin.b[pi + s1] + -3 * cin.b[pi + s2] + 64 >> 7);
			cout.b[po] = v1 & 255;
			po += w;
			var v2 = hxd.res.NanoJpeg.njClip(28 * cin.b[pi] + 109 * cin.b[pi + s1] + -9 * cin.b[pi + s2] + 64 >> 7);
			cout.b[po] = v2 & 255;
			po += w;
			pi += s1;
			var _g2 = 0;
			var _g1 = c.height - 2;
			while(_g2 < _g1) {
				var y = _g2++;
				var v3 = hxd.res.NanoJpeg.njClip(-9 * cin.b[pi - s1] + 111 * cin.b[pi] + 29 * cin.b[pi + s1] + -3 * cin.b[pi + s2] + 64 >> 7);
				cout.b[po] = v3 & 255;
				po += w;
				var v4 = hxd.res.NanoJpeg.njClip(-3 * cin.b[pi - s1] + 29 * cin.b[pi] + 111 * cin.b[pi + s1] + -9 * cin.b[pi + s2] + 64 >> 7);
				cout.b[po] = v4 & 255;
				po += w;
				pi += s1;
			}
			pi += s1;
			var v5 = hxd.res.NanoJpeg.njClip(28 * cin.b[pi] + 109 * cin.b[pi - s1] + -9 * cin.b[pi - s2] + 64 >> 7);
			cout.b[po] = v5 & 255;
			po += w;
			var v6 = hxd.res.NanoJpeg.njClip(104 * cin.b[pi] + 27 * cin.b[pi - s1] + -3 * cin.b[pi - s2] + 64 >> 7);
			cout.b[po] = v6 & 255;
			po += w;
			var v7 = hxd.res.NanoJpeg.njClip(139 * cin.b[pi] + -11 * cin.b[pi - s1] + 64 >> 7);
			cout.b[po] = v7 & 255;
		}
		c.height <<= 1;
		c.stride = c.width;
		hxd.impl.Tmp.saveBytes(c.pixels);
		c.pixels = out;
	}
	,njUpsample: function(c) {
		var xshift = 0;
		var yshift = 0;
		while(c.width < this.width) {
			c.width <<= 1;
			++xshift;
		}
		while(c.height < this.height) {
			c.height <<= 1;
			++yshift;
		}
		var out = hxd.impl.Tmp.getBytes(c.width * c.height);
		var lin = c.pixels;
		var pout = 0;
		var lout = out;
		var _g1 = 0;
		var _g = c.height;
		while(_g1 < _g) {
			var y = _g1++;
			var pin = (y >> yshift) * c.stride;
			var _g3 = 0;
			var _g2 = c.width;
			while(_g3 < _g2) {
				var x = _g3++;
				var pos = pout++;
				lout.b[pos] = lin.b[(x >> xshift) + pin] & 255;
			}
		}
		c.stride = c.width;
		hxd.impl.Tmp.saveBytes(c.pixels);
		c.pixels = out;
	}
	,njConvert: function() {
		var _g1 = 0;
		var _g = this.ncomp;
		while(_g1 < _g) {
			var i = _g1++;
			var c = this.comps[i];
			var _g2 = this.filter;
			switch(_g2[1]) {
			case 0:
				if(c.width < this.width || c.height < this.height) this.njUpsample(c);
				break;
			case 1:
				while(c.width < this.width || c.height < this.height) {
					if(c.width < this.width) this.njUpsampleH(c);
					if(c.height < this.height) this.njUpsampleV(c);
				}
				break;
			}
			if(c.width < this.width || c.height < this.height) throw "assert";
		}
		var pixels = hxd.impl.Tmp.getBytes(this.width * this.height * 4);
		if(this.ncomp == 3) {
			var py = this.comps[0].pixels;
			var pcb = this.comps[1].pixels;
			var pcr = this.comps[2].pixels;
			var pix = pixels;
			var k1 = 0;
			var k2 = 0;
			var k3 = 0;
			var out = 0;
			var _g11 = 0;
			var _g3 = this.height;
			while(_g11 < _g3) {
				var yy = _g11++;
				var _g31 = 0;
				var _g21 = this.width;
				while(_g31 < _g21) {
					var x = _g31++;
					var y;
					y = (function($this) {
						var $r;
						var i1 = k1++;
						$r = py.b[i1];
						return $r;
					}(this)) << 8;
					var cb;
					cb = (function($this) {
						var $r;
						var i2 = k2++;
						$r = pcb.b[i2];
						return $r;
					}(this)) - 128;
					var cr;
					cr = (function($this) {
						var $r;
						var i3 = k3++;
						$r = pcr.b[i3];
						return $r;
					}(this)) - 128;
					var r = hxd.res.NanoJpeg.njClip(y + 359 * cr + 128 >> 8);
					var g = hxd.res.NanoJpeg.njClip(y - 88 * cb - 183 * cr + 128 >> 8);
					var b = hxd.res.NanoJpeg.njClip(y + 454 * cb + 128 >> 8);
					var out1 = out++;
					pix.b[out1] = b & 255;
					var out2 = out++;
					pix.b[out2] = g & 255;
					var out3 = out++;
					pix.b[out3] = r & 255;
					var out4 = out++;
					pix.b[out4] = 255;
				}
				k1 += this.comps[0].stride - this.width;
				k2 += this.comps[1].stride - this.width;
				k3 += this.comps[2].stride - this.width;
			}
		} else throw "TODO";
		return pixels;
	}
	,njDecode: function() {
		if(this.size < 2 || this.bytes.b[this.pos] != 255 || this.bytes.b[this.pos + 1] != 216) throw "This file is not a JPEG";
		this.pos += 2;
		this.size -= 2;
		this.length -= 2;
		null;
		try {
			while(true) {
				this.pos += 2;
				this.size -= 2;
				this.length -= 2;
				null;
				var _g = this.bytes.b[this.pos + -1];
				switch(_g) {
				case 192:
					this.njDecodeSOF();
					break;
				case 219:
					this.njDecodeDQT();
					break;
				case 196:
					this.njDecodeDHT();
					break;
				case 221:
					this.njDecodeDRI();
					break;
				case 218:
					this.njDecodeScan();
					throw "__break__";
					break;
				case 254:
					this.length = this.bytes.b[this.pos] << 8 | this.bytes.b[this.pos + 1];
					this.pos += 2;
					this.size -= 2;
					this.length -= 2;
					null;
					this.njSkip(this.length);
					break;
				case 194:
					throw "Unsupported progressive JPG";
					break;
				case 195:
					throw "Unsupported lossless JPG";
					break;
				default:
					var _g1 = this.bytes.b[this.pos + -1] & 240;
					switch(_g1) {
					case 224:
						this.length = this.bytes.b[this.pos] << 8 | this.bytes.b[this.pos + 1];
						this.pos += 2;
						this.size -= 2;
						this.length -= 2;
						null;
						this.njSkip(this.length);
						break;
					case 192:
						throw "Unsupported jpeg type " + (this.bytes.b[this.pos + -1] & 15);
						break;
					default:
						throw "Unsupported jpeg tag 0x" + StringTools.hex(this.bytes.b[this.pos + -1],2);
					}
				}
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		var pixels = this.njConvert();
		this.cleanup();
		return { pixels : pixels, width : this.width, height : this.height};
	}
	,__class__: hxd.res.NanoJpeg
};
hxd.res.NotFound = function(path) {
	this.path = path;
};
$hxClasses["hxd.res.NotFound"] = hxd.res.NotFound;
hxd.res.NotFound.__name__ = true;
hxd.res.NotFound.prototype = {
	toString: function() {
		return "Resource file not found '" + this.path + "'";
	}
	,__class__: hxd.res.NotFound
};
hxsl.Type = $hxClasses["hxsl.Type"] = { __ename__ : true, __constructs__ : ["TVoid","TInt","TBool","TFloat","TString","TVec","TMat3","TMat4","TMat3x4","TBytes","TSampler2D","TSamplerCube","TStruct","TFun","TArray"] };
hxsl.Type.TVoid = ["TVoid",0];
hxsl.Type.TVoid.toString = $estr;
hxsl.Type.TVoid.__enum__ = hxsl.Type;
hxsl.Type.TInt = ["TInt",1];
hxsl.Type.TInt.toString = $estr;
hxsl.Type.TInt.__enum__ = hxsl.Type;
hxsl.Type.TBool = ["TBool",2];
hxsl.Type.TBool.toString = $estr;
hxsl.Type.TBool.__enum__ = hxsl.Type;
hxsl.Type.TFloat = ["TFloat",3];
hxsl.Type.TFloat.toString = $estr;
hxsl.Type.TFloat.__enum__ = hxsl.Type;
hxsl.Type.TString = ["TString",4];
hxsl.Type.TString.toString = $estr;
hxsl.Type.TString.__enum__ = hxsl.Type;
hxsl.Type.TVec = function(size,t) { var $x = ["TVec",5,size,t]; $x.__enum__ = hxsl.Type; $x.toString = $estr; return $x; };
hxsl.Type.TMat3 = ["TMat3",6];
hxsl.Type.TMat3.toString = $estr;
hxsl.Type.TMat3.__enum__ = hxsl.Type;
hxsl.Type.TMat4 = ["TMat4",7];
hxsl.Type.TMat4.toString = $estr;
hxsl.Type.TMat4.__enum__ = hxsl.Type;
hxsl.Type.TMat3x4 = ["TMat3x4",8];
hxsl.Type.TMat3x4.toString = $estr;
hxsl.Type.TMat3x4.__enum__ = hxsl.Type;
hxsl.Type.TBytes = function(size) { var $x = ["TBytes",9,size]; $x.__enum__ = hxsl.Type; $x.toString = $estr; return $x; };
hxsl.Type.TSampler2D = ["TSampler2D",10];
hxsl.Type.TSampler2D.toString = $estr;
hxsl.Type.TSampler2D.__enum__ = hxsl.Type;
hxsl.Type.TSamplerCube = ["TSamplerCube",11];
hxsl.Type.TSamplerCube.toString = $estr;
hxsl.Type.TSamplerCube.__enum__ = hxsl.Type;
hxsl.Type.TStruct = function(vl) { var $x = ["TStruct",12,vl]; $x.__enum__ = hxsl.Type; $x.toString = $estr; return $x; };
hxsl.Type.TFun = function(variants) { var $x = ["TFun",13,variants]; $x.__enum__ = hxsl.Type; $x.toString = $estr; return $x; };
hxsl.Type.TArray = function(t,size) { var $x = ["TArray",14,t,size]; $x.__enum__ = hxsl.Type; $x.toString = $estr; return $x; };
hxsl.Type.__empty_constructs__ = [hxsl.Type.TVoid,hxsl.Type.TInt,hxsl.Type.TBool,hxsl.Type.TFloat,hxsl.Type.TString,hxsl.Type.TMat3,hxsl.Type.TMat4,hxsl.Type.TMat3x4,hxsl.Type.TSampler2D,hxsl.Type.TSamplerCube];
hxsl.VecType = $hxClasses["hxsl.VecType"] = { __ename__ : true, __constructs__ : ["VInt","VFloat","VBool"] };
hxsl.VecType.VInt = ["VInt",0];
hxsl.VecType.VInt.toString = $estr;
hxsl.VecType.VInt.__enum__ = hxsl.VecType;
hxsl.VecType.VFloat = ["VFloat",1];
hxsl.VecType.VFloat.toString = $estr;
hxsl.VecType.VFloat.__enum__ = hxsl.VecType;
hxsl.VecType.VBool = ["VBool",2];
hxsl.VecType.VBool.toString = $estr;
hxsl.VecType.VBool.__enum__ = hxsl.VecType;
hxsl.VecType.__empty_constructs__ = [hxsl.VecType.VInt,hxsl.VecType.VFloat,hxsl.VecType.VBool];
hxsl.SizeDecl = $hxClasses["hxsl.SizeDecl"] = { __ename__ : true, __constructs__ : ["SConst","SVar"] };
hxsl.SizeDecl.SConst = function(v) { var $x = ["SConst",0,v]; $x.__enum__ = hxsl.SizeDecl; $x.toString = $estr; return $x; };
hxsl.SizeDecl.SVar = function(v) { var $x = ["SVar",1,v]; $x.__enum__ = hxsl.SizeDecl; $x.toString = $estr; return $x; };
hxsl.SizeDecl.__empty_constructs__ = [];
hxsl.Error = function(msg,pos) {
	this.msg = msg;
	this.pos = pos;
};
$hxClasses["hxsl.Error"] = hxsl.Error;
hxsl.Error.__name__ = true;
hxsl.Error.t = function(msg,pos) {
	throw new hxsl.Error(msg,pos);
	return null;
};
hxsl.Error.prototype = {
	toString: function() {
		return "Error(" + this.msg + ")@" + Std.string(this.pos);
	}
	,__class__: hxsl.Error
};
hxsl.VarKind = $hxClasses["hxsl.VarKind"] = { __ename__ : true, __constructs__ : ["Global","Input","Param","Var","Local","Output","Function"] };
hxsl.VarKind.Global = ["Global",0];
hxsl.VarKind.Global.toString = $estr;
hxsl.VarKind.Global.__enum__ = hxsl.VarKind;
hxsl.VarKind.Input = ["Input",1];
hxsl.VarKind.Input.toString = $estr;
hxsl.VarKind.Input.__enum__ = hxsl.VarKind;
hxsl.VarKind.Param = ["Param",2];
hxsl.VarKind.Param.toString = $estr;
hxsl.VarKind.Param.__enum__ = hxsl.VarKind;
hxsl.VarKind.Var = ["Var",3];
hxsl.VarKind.Var.toString = $estr;
hxsl.VarKind.Var.__enum__ = hxsl.VarKind;
hxsl.VarKind.Local = ["Local",4];
hxsl.VarKind.Local.toString = $estr;
hxsl.VarKind.Local.__enum__ = hxsl.VarKind;
hxsl.VarKind.Output = ["Output",5];
hxsl.VarKind.Output.toString = $estr;
hxsl.VarKind.Output.__enum__ = hxsl.VarKind;
hxsl.VarKind.Function = ["Function",6];
hxsl.VarKind.Function.toString = $estr;
hxsl.VarKind.Function.__enum__ = hxsl.VarKind;
hxsl.VarKind.__empty_constructs__ = [hxsl.VarKind.Global,hxsl.VarKind.Input,hxsl.VarKind.Param,hxsl.VarKind.Var,hxsl.VarKind.Local,hxsl.VarKind.Output,hxsl.VarKind.Function];
hxsl.VarQualifier = $hxClasses["hxsl.VarQualifier"] = { __ename__ : true, __constructs__ : ["Const","Private","Nullable","PerObject","Name"] };
hxsl.VarQualifier.Const = function(max) { var $x = ["Const",0,max]; $x.__enum__ = hxsl.VarQualifier; $x.toString = $estr; return $x; };
hxsl.VarQualifier.Private = ["Private",1];
hxsl.VarQualifier.Private.toString = $estr;
hxsl.VarQualifier.Private.__enum__ = hxsl.VarQualifier;
hxsl.VarQualifier.Nullable = ["Nullable",2];
hxsl.VarQualifier.Nullable.toString = $estr;
hxsl.VarQualifier.Nullable.__enum__ = hxsl.VarQualifier;
hxsl.VarQualifier.PerObject = ["PerObject",3];
hxsl.VarQualifier.PerObject.toString = $estr;
hxsl.VarQualifier.PerObject.__enum__ = hxsl.VarQualifier;
hxsl.VarQualifier.Name = function(n) { var $x = ["Name",4,n]; $x.__enum__ = hxsl.VarQualifier; $x.toString = $estr; return $x; };
hxsl.VarQualifier.__empty_constructs__ = [hxsl.VarQualifier.Private,hxsl.VarQualifier.Nullable,hxsl.VarQualifier.PerObject];
hxsl.Const = $hxClasses["hxsl.Const"] = { __ename__ : true, __constructs__ : ["CNull","CBool","CInt","CFloat","CString"] };
hxsl.Const.CNull = ["CNull",0];
hxsl.Const.CNull.toString = $estr;
hxsl.Const.CNull.__enum__ = hxsl.Const;
hxsl.Const.CBool = function(b) { var $x = ["CBool",1,b]; $x.__enum__ = hxsl.Const; $x.toString = $estr; return $x; };
hxsl.Const.CInt = function(v) { var $x = ["CInt",2,v]; $x.__enum__ = hxsl.Const; $x.toString = $estr; return $x; };
hxsl.Const.CFloat = function(v) { var $x = ["CFloat",3,v]; $x.__enum__ = hxsl.Const; $x.toString = $estr; return $x; };
hxsl.Const.CString = function(v) { var $x = ["CString",4,v]; $x.__enum__ = hxsl.Const; $x.toString = $estr; return $x; };
hxsl.Const.__empty_constructs__ = [hxsl.Const.CNull];
hxsl.FunctionKind = $hxClasses["hxsl.FunctionKind"] = { __ename__ : true, __constructs__ : ["Vertex","Fragment","Init","Helper"] };
hxsl.FunctionKind.Vertex = ["Vertex",0];
hxsl.FunctionKind.Vertex.toString = $estr;
hxsl.FunctionKind.Vertex.__enum__ = hxsl.FunctionKind;
hxsl.FunctionKind.Fragment = ["Fragment",1];
hxsl.FunctionKind.Fragment.toString = $estr;
hxsl.FunctionKind.Fragment.__enum__ = hxsl.FunctionKind;
hxsl.FunctionKind.Init = ["Init",2];
hxsl.FunctionKind.Init.toString = $estr;
hxsl.FunctionKind.Init.__enum__ = hxsl.FunctionKind;
hxsl.FunctionKind.Helper = ["Helper",3];
hxsl.FunctionKind.Helper.toString = $estr;
hxsl.FunctionKind.Helper.__enum__ = hxsl.FunctionKind;
hxsl.FunctionKind.__empty_constructs__ = [hxsl.FunctionKind.Vertex,hxsl.FunctionKind.Fragment,hxsl.FunctionKind.Init,hxsl.FunctionKind.Helper];
hxsl.TGlobal = $hxClasses["hxsl.TGlobal"] = { __ename__ : true, __constructs__ : ["Radians","Degrees","Sin","Cos","Tan","Asin","Acos","Atan","Pow","Exp","Log","Exp2","Log2","Sqrt","Inversesqrt","Abs","Sign","Floor","Ceil","Fract","Mod","Min","Max","Clamp","Mix","Step","SmoothStep","Length","Distance","Dot","Cross","Normalize","Texture2D","TextureCube","ToInt","ToFloat","ToBool","Vec2","Vec3","Vec4","IVec2","IVec3","IVec4","BVec2","BVec3","BVec4","Mat2","Mat3","Mat4","Mat3x4","Saturate","Pack","Unpack","DFdx","DFdy","Fwidth"] };
hxsl.TGlobal.Radians = ["Radians",0];
hxsl.TGlobal.Radians.toString = $estr;
hxsl.TGlobal.Radians.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Degrees = ["Degrees",1];
hxsl.TGlobal.Degrees.toString = $estr;
hxsl.TGlobal.Degrees.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Sin = ["Sin",2];
hxsl.TGlobal.Sin.toString = $estr;
hxsl.TGlobal.Sin.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Cos = ["Cos",3];
hxsl.TGlobal.Cos.toString = $estr;
hxsl.TGlobal.Cos.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Tan = ["Tan",4];
hxsl.TGlobal.Tan.toString = $estr;
hxsl.TGlobal.Tan.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Asin = ["Asin",5];
hxsl.TGlobal.Asin.toString = $estr;
hxsl.TGlobal.Asin.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Acos = ["Acos",6];
hxsl.TGlobal.Acos.toString = $estr;
hxsl.TGlobal.Acos.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Atan = ["Atan",7];
hxsl.TGlobal.Atan.toString = $estr;
hxsl.TGlobal.Atan.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Pow = ["Pow",8];
hxsl.TGlobal.Pow.toString = $estr;
hxsl.TGlobal.Pow.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Exp = ["Exp",9];
hxsl.TGlobal.Exp.toString = $estr;
hxsl.TGlobal.Exp.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Log = ["Log",10];
hxsl.TGlobal.Log.toString = $estr;
hxsl.TGlobal.Log.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Exp2 = ["Exp2",11];
hxsl.TGlobal.Exp2.toString = $estr;
hxsl.TGlobal.Exp2.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Log2 = ["Log2",12];
hxsl.TGlobal.Log2.toString = $estr;
hxsl.TGlobal.Log2.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Sqrt = ["Sqrt",13];
hxsl.TGlobal.Sqrt.toString = $estr;
hxsl.TGlobal.Sqrt.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Inversesqrt = ["Inversesqrt",14];
hxsl.TGlobal.Inversesqrt.toString = $estr;
hxsl.TGlobal.Inversesqrt.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Abs = ["Abs",15];
hxsl.TGlobal.Abs.toString = $estr;
hxsl.TGlobal.Abs.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Sign = ["Sign",16];
hxsl.TGlobal.Sign.toString = $estr;
hxsl.TGlobal.Sign.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Floor = ["Floor",17];
hxsl.TGlobal.Floor.toString = $estr;
hxsl.TGlobal.Floor.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Ceil = ["Ceil",18];
hxsl.TGlobal.Ceil.toString = $estr;
hxsl.TGlobal.Ceil.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Fract = ["Fract",19];
hxsl.TGlobal.Fract.toString = $estr;
hxsl.TGlobal.Fract.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Mod = ["Mod",20];
hxsl.TGlobal.Mod.toString = $estr;
hxsl.TGlobal.Mod.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Min = ["Min",21];
hxsl.TGlobal.Min.toString = $estr;
hxsl.TGlobal.Min.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Max = ["Max",22];
hxsl.TGlobal.Max.toString = $estr;
hxsl.TGlobal.Max.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Clamp = ["Clamp",23];
hxsl.TGlobal.Clamp.toString = $estr;
hxsl.TGlobal.Clamp.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Mix = ["Mix",24];
hxsl.TGlobal.Mix.toString = $estr;
hxsl.TGlobal.Mix.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Step = ["Step",25];
hxsl.TGlobal.Step.toString = $estr;
hxsl.TGlobal.Step.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.SmoothStep = ["SmoothStep",26];
hxsl.TGlobal.SmoothStep.toString = $estr;
hxsl.TGlobal.SmoothStep.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Length = ["Length",27];
hxsl.TGlobal.Length.toString = $estr;
hxsl.TGlobal.Length.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Distance = ["Distance",28];
hxsl.TGlobal.Distance.toString = $estr;
hxsl.TGlobal.Distance.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Dot = ["Dot",29];
hxsl.TGlobal.Dot.toString = $estr;
hxsl.TGlobal.Dot.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Cross = ["Cross",30];
hxsl.TGlobal.Cross.toString = $estr;
hxsl.TGlobal.Cross.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Normalize = ["Normalize",31];
hxsl.TGlobal.Normalize.toString = $estr;
hxsl.TGlobal.Normalize.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Texture2D = ["Texture2D",32];
hxsl.TGlobal.Texture2D.toString = $estr;
hxsl.TGlobal.Texture2D.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.TextureCube = ["TextureCube",33];
hxsl.TGlobal.TextureCube.toString = $estr;
hxsl.TGlobal.TextureCube.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.ToInt = ["ToInt",34];
hxsl.TGlobal.ToInt.toString = $estr;
hxsl.TGlobal.ToInt.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.ToFloat = ["ToFloat",35];
hxsl.TGlobal.ToFloat.toString = $estr;
hxsl.TGlobal.ToFloat.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.ToBool = ["ToBool",36];
hxsl.TGlobal.ToBool.toString = $estr;
hxsl.TGlobal.ToBool.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Vec2 = ["Vec2",37];
hxsl.TGlobal.Vec2.toString = $estr;
hxsl.TGlobal.Vec2.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Vec3 = ["Vec3",38];
hxsl.TGlobal.Vec3.toString = $estr;
hxsl.TGlobal.Vec3.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Vec4 = ["Vec4",39];
hxsl.TGlobal.Vec4.toString = $estr;
hxsl.TGlobal.Vec4.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.IVec2 = ["IVec2",40];
hxsl.TGlobal.IVec2.toString = $estr;
hxsl.TGlobal.IVec2.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.IVec3 = ["IVec3",41];
hxsl.TGlobal.IVec3.toString = $estr;
hxsl.TGlobal.IVec3.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.IVec4 = ["IVec4",42];
hxsl.TGlobal.IVec4.toString = $estr;
hxsl.TGlobal.IVec4.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.BVec2 = ["BVec2",43];
hxsl.TGlobal.BVec2.toString = $estr;
hxsl.TGlobal.BVec2.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.BVec3 = ["BVec3",44];
hxsl.TGlobal.BVec3.toString = $estr;
hxsl.TGlobal.BVec3.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.BVec4 = ["BVec4",45];
hxsl.TGlobal.BVec4.toString = $estr;
hxsl.TGlobal.BVec4.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Mat2 = ["Mat2",46];
hxsl.TGlobal.Mat2.toString = $estr;
hxsl.TGlobal.Mat2.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Mat3 = ["Mat3",47];
hxsl.TGlobal.Mat3.toString = $estr;
hxsl.TGlobal.Mat3.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Mat4 = ["Mat4",48];
hxsl.TGlobal.Mat4.toString = $estr;
hxsl.TGlobal.Mat4.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Mat3x4 = ["Mat3x4",49];
hxsl.TGlobal.Mat3x4.toString = $estr;
hxsl.TGlobal.Mat3x4.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Saturate = ["Saturate",50];
hxsl.TGlobal.Saturate.toString = $estr;
hxsl.TGlobal.Saturate.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Pack = ["Pack",51];
hxsl.TGlobal.Pack.toString = $estr;
hxsl.TGlobal.Pack.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Unpack = ["Unpack",52];
hxsl.TGlobal.Unpack.toString = $estr;
hxsl.TGlobal.Unpack.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.DFdx = ["DFdx",53];
hxsl.TGlobal.DFdx.toString = $estr;
hxsl.TGlobal.DFdx.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.DFdy = ["DFdy",54];
hxsl.TGlobal.DFdy.toString = $estr;
hxsl.TGlobal.DFdy.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.Fwidth = ["Fwidth",55];
hxsl.TGlobal.Fwidth.toString = $estr;
hxsl.TGlobal.Fwidth.__enum__ = hxsl.TGlobal;
hxsl.TGlobal.__empty_constructs__ = [hxsl.TGlobal.Radians,hxsl.TGlobal.Degrees,hxsl.TGlobal.Sin,hxsl.TGlobal.Cos,hxsl.TGlobal.Tan,hxsl.TGlobal.Asin,hxsl.TGlobal.Acos,hxsl.TGlobal.Atan,hxsl.TGlobal.Pow,hxsl.TGlobal.Exp,hxsl.TGlobal.Log,hxsl.TGlobal.Exp2,hxsl.TGlobal.Log2,hxsl.TGlobal.Sqrt,hxsl.TGlobal.Inversesqrt,hxsl.TGlobal.Abs,hxsl.TGlobal.Sign,hxsl.TGlobal.Floor,hxsl.TGlobal.Ceil,hxsl.TGlobal.Fract,hxsl.TGlobal.Mod,hxsl.TGlobal.Min,hxsl.TGlobal.Max,hxsl.TGlobal.Clamp,hxsl.TGlobal.Mix,hxsl.TGlobal.Step,hxsl.TGlobal.SmoothStep,hxsl.TGlobal.Length,hxsl.TGlobal.Distance,hxsl.TGlobal.Dot,hxsl.TGlobal.Cross,hxsl.TGlobal.Normalize,hxsl.TGlobal.Texture2D,hxsl.TGlobal.TextureCube,hxsl.TGlobal.ToInt,hxsl.TGlobal.ToFloat,hxsl.TGlobal.ToBool,hxsl.TGlobal.Vec2,hxsl.TGlobal.Vec3,hxsl.TGlobal.Vec4,hxsl.TGlobal.IVec2,hxsl.TGlobal.IVec3,hxsl.TGlobal.IVec4,hxsl.TGlobal.BVec2,hxsl.TGlobal.BVec3,hxsl.TGlobal.BVec4,hxsl.TGlobal.Mat2,hxsl.TGlobal.Mat3,hxsl.TGlobal.Mat4,hxsl.TGlobal.Mat3x4,hxsl.TGlobal.Saturate,hxsl.TGlobal.Pack,hxsl.TGlobal.Unpack,hxsl.TGlobal.DFdx,hxsl.TGlobal.DFdy,hxsl.TGlobal.Fwidth];
hxsl.TExprDef = $hxClasses["hxsl.TExprDef"] = { __ename__ : true, __constructs__ : ["TConst","TVar","TGlobal","TParenthesis","TBlock","TBinop","TUnop","TVarDecl","TCall","TSwiz","TIf","TDiscard","TReturn","TFor","TContinue","TBreak","TArray","TArrayDecl"] };
hxsl.TExprDef.TConst = function(c) { var $x = ["TConst",0,c]; $x.__enum__ = hxsl.TExprDef; $x.toString = $estr; return $x; };
hxsl.TExprDef.TVar = function(v) { var $x = ["TVar",1,v]; $x.__enum__ = hxsl.TExprDef; $x.toString = $estr; return $x; };
hxsl.TExprDef.TGlobal = function(g) { var $x = ["TGlobal",2,g]; $x.__enum__ = hxsl.TExprDef; $x.toString = $estr; return $x; };
hxsl.TExprDef.TParenthesis = function(e) { var $x = ["TParenthesis",3,e]; $x.__enum__ = hxsl.TExprDef; $x.toString = $estr; return $x; };
hxsl.TExprDef.TBlock = function(el) { var $x = ["TBlock",4,el]; $x.__enum__ = hxsl.TExprDef; $x.toString = $estr; return $x; };
hxsl.TExprDef.TBinop = function(op,e1,e2) { var $x = ["TBinop",5,op,e1,e2]; $x.__enum__ = hxsl.TExprDef; $x.toString = $estr; return $x; };
hxsl.TExprDef.TUnop = function(op,e1) { var $x = ["TUnop",6,op,e1]; $x.__enum__ = hxsl.TExprDef; $x.toString = $estr; return $x; };
hxsl.TExprDef.TVarDecl = function(v,init) { var $x = ["TVarDecl",7,v,init]; $x.__enum__ = hxsl.TExprDef; $x.toString = $estr; return $x; };
hxsl.TExprDef.TCall = function(e,args) { var $x = ["TCall",8,e,args]; $x.__enum__ = hxsl.TExprDef; $x.toString = $estr; return $x; };
hxsl.TExprDef.TSwiz = function(e,regs) { var $x = ["TSwiz",9,e,regs]; $x.__enum__ = hxsl.TExprDef; $x.toString = $estr; return $x; };
hxsl.TExprDef.TIf = function(econd,eif,eelse) { var $x = ["TIf",10,econd,eif,eelse]; $x.__enum__ = hxsl.TExprDef; $x.toString = $estr; return $x; };
hxsl.TExprDef.TDiscard = ["TDiscard",11];
hxsl.TExprDef.TDiscard.toString = $estr;
hxsl.TExprDef.TDiscard.__enum__ = hxsl.TExprDef;
hxsl.TExprDef.TReturn = function(e) { var $x = ["TReturn",12,e]; $x.__enum__ = hxsl.TExprDef; $x.toString = $estr; return $x; };
hxsl.TExprDef.TFor = function(v,it,loop) { var $x = ["TFor",13,v,it,loop]; $x.__enum__ = hxsl.TExprDef; $x.toString = $estr; return $x; };
hxsl.TExprDef.TContinue = ["TContinue",14];
hxsl.TExprDef.TContinue.toString = $estr;
hxsl.TExprDef.TContinue.__enum__ = hxsl.TExprDef;
hxsl.TExprDef.TBreak = ["TBreak",15];
hxsl.TExprDef.TBreak.toString = $estr;
hxsl.TExprDef.TBreak.__enum__ = hxsl.TExprDef;
hxsl.TExprDef.TArray = function(e,index) { var $x = ["TArray",16,e,index]; $x.__enum__ = hxsl.TExprDef; $x.toString = $estr; return $x; };
hxsl.TExprDef.TArrayDecl = function(el) { var $x = ["TArrayDecl",17,el]; $x.__enum__ = hxsl.TExprDef; $x.toString = $estr; return $x; };
hxsl.TExprDef.__empty_constructs__ = [hxsl.TExprDef.TDiscard,hxsl.TExprDef.TContinue,hxsl.TExprDef.TBreak];
hxsl.Tools2 = function() { };
$hxClasses["hxsl.Tools2"] = hxsl.Tools2;
hxsl.Tools2.__name__ = true;
hxsl.Tools2.toString = function(g) {
	var n = g[0];
	return n.charAt(0).toLowerCase() + HxOverrides.substr(n,1,null);
};
hxsl.SearchMap = function() {
};
$hxClasses["hxsl.SearchMap"] = hxsl.SearchMap;
hxsl.SearchMap.__name__ = true;
hxsl.SearchMap.prototype = {
	__class__: hxsl.SearchMap
};
hxsl.Cache = function() {
	this.constsToGlobal = false;
	this.linkCache = new haxe.ds.IntMap();
	this.outVarsMap = new haxe.ds.StringMap();
	this.outVars = [];
};
$hxClasses["hxsl.Cache"] = hxsl.Cache;
hxsl.Cache.__name__ = true;
hxsl.Cache.get = function() {
	var c = hxsl.Cache.INST;
	if(c == null) hxsl.Cache.INST = c = new hxsl.Cache();
	return c;
};
hxsl.Cache.prototype = {
	allocOutputVars: function(vars) {
		var key = vars.join(",");
		var id = this.outVarsMap.get(key);
		if(id != null) return id;
		vars = vars.slice();
		vars.sort(Reflect.compare);
		var key1 = vars.join(",");
		id = this.outVarsMap.get(key1);
		if(id != null) {
			this.outVarsMap.set(key,id);
			return id;
		}
		id = this.outVars.length;
		this.outVars.push(vars);
		this.outVarsMap.set(key,id);
		return id;
	}
	,link: function(instances,outVars) {
		var c = this.linkCache.get(outVars);
		if(c == null) {
			c = new hxsl.SearchMap();
			this.linkCache.set(outVars,c);
		}
		var _g = 0;
		while(_g < instances.length) {
			var i = instances[_g];
			++_g;
			if(i == null) break;
			if(c.next == null) c.next = new haxe.ds.IntMap();
			var cs = c.next.get(i.id);
			if(cs == null) {
				cs = new hxsl.SearchMap();
				c.next.set(i.id,cs);
			}
			c = cs;
		}
		if(c.linked != null) return c.linked;
		var linker = new hxsl.Linker();
		var shaders = [];
		var _g1 = 0;
		while(_g1 < instances.length) {
			var i1 = instances[_g1];
			++_g1;
			if(i1 == null) break;
			shaders.push(i1.shader);
		}
		var s = linker.link(shaders,this.outVars[outVars]);
		var paramVars = new haxe.ds.IntMap();
		var _g2 = 0;
		var _g11 = linker.allVars;
		while(_g2 < _g11.length) {
			var v = _g11[_g2];
			++_g2;
			if(v.v.kind == hxsl.VarKind.Param) {
				{
					var _g21 = v.v.type;
					switch(_g21[1]) {
					case 12:
						continue;
						break;
					default:
					}
				}
				var i2 = instances[v.instanceIndex];
				var value = { instance : v.instanceIndex, index : i2.params.get(v.merged[0].id)};
				paramVars.set(v.id,value);
			}
		}
		var s1 = new hxsl.Splitter().split(s);
		var s2 = new hxsl.Dce().dce(s1.vertex,s1.fragment);
		var r = new hxsl.RuntimeShader();
		r.vertex = this.flattenShader(s2.vertex,hxsl.FunctionKind.Vertex,paramVars);
		r.vertex.vertex = true;
		r.fragment = this.flattenShader(s2.fragment,hxsl.FunctionKind.Fragment,paramVars);
		c.linked = r;
		return r;
	}
	,getPath: function(v) {
		if(v.parent == null) return v.name;
		return this.getPath(v.parent) + "." + v.name;
	}
	,flattenShader: function(s,kind,params) {
		var flat = new hxsl.Flatten();
		var c = new hxsl.RuntimeShaderData();
		var data = flat.flatten(s,kind,this.constsToGlobal);
		c.consts = flat.consts;
		var $it0 = flat.allocData.keys();
		while( $it0.hasNext() ) {
			var g = $it0.next();
			var alloc = flat.allocData.h[g.__id__];
			var _g = g.kind;
			switch(_g[1]) {
			case 2:
				var out = [];
				var _g1 = 0;
				while(_g1 < alloc.length) {
					var a = alloc[_g1];
					++_g1;
					if(a.v == null) continue;
					var p = params.get(a.v.id);
					if(p == null) {
						var ap = new hxsl.AllocParam(a.v.name,a.pos,-1,-1,a.v.type);
						ap.perObjectGlobal = new hxsl.AllocGlobal(-1,this.getPath(a.v),a.v.type);
						out.push(ap);
						continue;
					}
					out.push(new hxsl.AllocParam(a.v.name,a.pos,p.instance,p.index,a.v.type));
				}
				{
					var _g11 = g.type;
					switch(_g11[1]) {
					case 14:
						switch(_g11[2][1]) {
						case 10:
							c.textures = out;
							break;
						case 5:
							switch(_g11[2][2]) {
							case 4:
								switch(_g11[2][3][1]) {
								case 1:
									switch(_g11[3][1]) {
									case 0:
										var size = _g11[3][2];
										c.params = out;
										c.paramsSize = size;
										break;
									default:
										throw "assert";
									}
									break;
								default:
									throw "assert";
								}
								break;
							default:
								throw "assert";
							}
							break;
						default:
							throw "assert";
						}
						break;
					default:
						throw "assert";
					}
				}
				break;
			case 0:
				var out1;
				var _g12 = [];
				var _g2 = 0;
				while(_g2 < alloc.length) {
					var a1 = alloc[_g2];
					++_g2;
					if(a1.v != null) _g12.push(new hxsl.AllocGlobal(a1.pos,this.getPath(a1.v),a1.v.type));
				}
				out1 = _g12;
				{
					var _g21 = g.type;
					switch(_g21[1]) {
					case 14:
						switch(_g21[2][1]) {
						case 5:
							switch(_g21[2][2]) {
							case 4:
								switch(_g21[2][3][1]) {
								case 1:
									switch(_g21[3][1]) {
									case 0:
										var size1 = _g21[3][2];
										c.globals = out1;
										c.globalsSize = size1;
										break;
									default:
										throw "assert";
									}
									break;
								default:
									throw "assert";
								}
								break;
							default:
								throw "assert";
							}
							break;
						default:
							throw "assert";
						}
						break;
					default:
						throw "assert";
					}
				}
				break;
			default:
				throw "assert";
			}
		}
		if(c.globals == null) {
			c.globals = [];
			c.globalsSize = 0;
		}
		if(c.params == null) {
			c.params = [];
			c.paramsSize = 0;
		}
		if(c.textures == null) c.textures = [];
		c.data = data;
		return c;
	}
	,__class__: hxsl.Cache
};
hxsl.Clone = function() {
	this.varMap = new haxe.ds.IntMap();
};
$hxClasses["hxsl.Clone"] = hxsl.Clone;
hxsl.Clone.__name__ = true;
hxsl.Clone.shaderData = function(s) {
	return new hxsl.Clone().shader(s);
};
hxsl.Clone.prototype = {
	tvar: function(v) {
		var v2 = this.varMap.get(v.id);
		if(v2 != null) return v2;
		v2 = { id : hxsl.Tools.allocVarId(), type : v.type, name : v.name, kind : v.kind};
		this.varMap.set(v.id,v2);
		if(v.parent != null) v2.parent = this.tvar(v.parent);
		if(v.qualifiers != null) v2.qualifiers = v.qualifiers.slice();
		v2.type = this.ttype(v.type);
		return v2;
	}
	,tfun: function(f) {
		return { ret : this.ttype(f.ret), kind : f.kind, ref : this.tvar(f.ref), args : (function($this) {
			var $r;
			var _g = [];
			{
				var _g1 = 0;
				var _g2 = f.args;
				while(_g1 < _g2.length) {
					var a = _g2[_g1];
					++_g1;
					_g.push($this.tvar(a));
				}
			}
			$r = _g;
			return $r;
		}(this)), expr : this.texpr(f.expr)};
	}
	,ttype: function(t) {
		switch(t[1]) {
		case 12:
			var vl = t[2];
			return hxsl.Type.TStruct((function($this) {
				var $r;
				var _g = [];
				{
					var _g1 = 0;
					while(_g1 < vl.length) {
						var v = vl[_g1];
						++_g1;
						_g.push($this.tvar(v));
					}
				}
				$r = _g;
				return $r;
			}(this)));
		case 14:
			var size = t[3];
			var t1 = t[2];
			return hxsl.Type.TArray(this.ttype(t1),(function($this) {
				var $r;
				switch(size[1]) {
				case 0:
					$r = size;
					break;
				case 1:
					$r = (function($this) {
						var $r;
						var v1 = size[2];
						$r = hxsl.SizeDecl.SVar($this.tvar(v1));
						return $r;
					}($this));
					break;
				}
				return $r;
			}(this)));
		case 13:
			var vars = t[2];
			return hxsl.Type.TFun((function($this) {
				var $r;
				var _g2 = [];
				{
					var _g11 = 0;
					while(_g11 < vars.length) {
						var v2 = vars[_g11];
						++_g11;
						_g2.push({ args : (function($this) {
							var $r;
							var _g21 = [];
							{
								var _g3 = 0;
								var _g4 = v2.args;
								while(_g3 < _g4.length) {
									var a = _g4[_g3];
									++_g3;
									_g21.push({ name : a.name, type : $this.ttype(a.type)});
								}
							}
							$r = _g21;
							return $r;
						}($this)), ret : $this.ttype(v2.ret)});
					}
				}
				$r = _g2;
				return $r;
			}(this)));
		default:
			return t;
		}
	}
	,texpr: function(e) {
		var e2 = hxsl.Tools.map(e,$bind(this,this.texpr));
		e2.t = this.ttype(e.t);
		{
			var _g = e2.e;
			switch(_g[1]) {
			case 1:
				var v = _g[2];
				e2.e = hxsl.TExprDef.TVar(this.tvar(v));
				break;
			case 7:
				var init = _g[3];
				var v1 = _g[2];
				e2.e = hxsl.TExprDef.TVarDecl(this.tvar(v1),init);
				break;
			case 13:
				var loop = _g[4];
				var it = _g[3];
				var v2 = _g[2];
				e2.e = hxsl.TExprDef.TFor(this.tvar(v2),it,loop);
				break;
			default:
				e2.e = e2.e;
			}
		}
		return e2;
	}
	,shader: function(s) {
		return { name : s.name, vars : (function($this) {
			var $r;
			var _g = [];
			{
				var _g1 = 0;
				var _g2 = s.vars;
				while(_g1 < _g2.length) {
					var v = _g2[_g1];
					++_g1;
					_g.push($this.tvar(v));
				}
			}
			$r = _g;
			return $r;
		}(this)), funs : (function($this) {
			var $r;
			var _g11 = [];
			{
				var _g21 = 0;
				var _g3 = s.funs;
				while(_g21 < _g3.length) {
					var f = _g3[_g21];
					++_g21;
					_g11.push($this.tfun(f));
				}
			}
			$r = _g11;
			return $r;
		}(this))};
	}
	,__class__: hxsl.Clone
};
hxsl._Dce = {};
hxsl._Dce.Exit = function() {
};
$hxClasses["hxsl._Dce.Exit"] = hxsl._Dce.Exit;
hxsl._Dce.Exit.__name__ = true;
hxsl._Dce.Exit.prototype = {
	__class__: hxsl._Dce.Exit
};
hxsl._Dce.VarDeps = function(v) {
	this.v = v;
	this.used = true;
	this.deps = new haxe.ds.IntMap();
};
$hxClasses["hxsl._Dce.VarDeps"] = hxsl._Dce.VarDeps;
hxsl._Dce.VarDeps.__name__ = true;
hxsl._Dce.VarDeps.prototype = {
	__class__: hxsl._Dce.VarDeps
};
hxsl.Dce = function() {
};
$hxClasses["hxsl.Dce"] = hxsl.Dce;
hxsl.Dce.__name__ = true;
hxsl.Dce.prototype = {
	dce: function(vertex,fragment) {
		this.used = new haxe.ds.IntMap();
		var _g = 0;
		var _g1 = vertex.vars;
		while(_g < _g1.length) {
			var v = _g1[_g];
			++_g;
			this.get(v);
		}
		var _g2 = 0;
		var _g11 = fragment.vars;
		while(_g2 < _g11.length) {
			var v1 = _g11[_g2];
			++_g2;
			this.get(v1);
		}
		var _g3 = 0;
		var _g12 = vertex.funs;
		while(_g3 < _g12.length) {
			var f = _g12[_g3];
			++_g3;
			this.check(f.expr,[]);
		}
		var _g4 = 0;
		var _g13 = fragment.funs;
		while(_g4 < _g13.length) {
			var f1 = _g13[_g4];
			++_g4;
			this.check(f1.expr,[]);
		}
		var changed = true;
		while(changed) {
			changed = false;
			var $it0 = this.used.iterator();
			while( $it0.hasNext() ) {
				var v2 = $it0.next();
				if(!v2.used || v2.v.kind == hxsl.VarKind.Output || v2.v.kind == hxsl.VarKind.Input || v2.keep) continue;
				var used = false;
				var $it1 = v2.deps.iterator();
				while( $it1.hasNext() ) {
					var d = $it1.next();
					if(d.used) {
						used = true;
						break;
					}
				}
				if(!used) {
					v2.used = false;
					changed = true;
					HxOverrides.remove(vertex.vars,v2.v);
					HxOverrides.remove(fragment.vars,v2.v);
				}
			}
		}
		var _g5 = 0;
		var _g14 = vertex.funs;
		while(_g5 < _g14.length) {
			var f2 = _g14[_g5];
			++_g5;
			f2.expr = this.mapExpr(f2.expr);
		}
		var _g6 = 0;
		var _g15 = fragment.funs;
		while(_g6 < _g15.length) {
			var f3 = _g15[_g6];
			++_g6;
			f3.expr = this.mapExpr(f3.expr);
		}
		return { fragment : fragment, vertex : vertex};
	}
	,get: function(v) {
		var vd = this.used.get(v.id);
		if(vd == null) {
			vd = new hxsl._Dce.VarDeps(v);
			this.used.set(v.id,vd);
		}
		return vd;
	}
	,link: function(v,writeTo) {
		var vd = this.get(v);
		var _g = 0;
		while(_g < writeTo.length) {
			var w = writeTo[_g];
			++_g;
			if(w == null) {
				vd.keep = true;
				continue;
			}
			vd.deps.set(w.v.id,w);
		}
	}
	,hasDiscardRec: function(e) {
		var _g = e.e;
		switch(_g[1]) {
		case 11:
			throw new hxsl._Dce.Exit();
			break;
		default:
			hxsl.Tools.iter(e,$bind(this,this.hasDiscardRec));
		}
	}
	,hasDiscard: function(e) {
		try {
			this.hasDiscardRec(e);
			return false;
		} catch( e1 ) {
			if( js.Boot.__instanceof(e1,hxsl._Dce.Exit) ) {
				return true;
			} else throw(e1);
		}
	}
	,check: function(e,writeTo) {
		{
			var _g = e.e;
			switch(_g[1]) {
			case 1:
				var v = _g[2];
				this.link(v,writeTo);
				break;
			case 5:
				switch(_g[2][1]) {
				case 4:
					switch(_g[3].e[1]) {
					case 1:
						var e1 = _g[4];
						var v1 = _g[3].e[2];
						writeTo.push(this.get(v1));
						this.check(e1,writeTo);
						writeTo.pop();
						break;
					case 9:
						switch(_g[3].e[2].e[1]) {
						case 1:
							var e1 = _g[4];
							var v1 = _g[3].e[2].e[2];
							writeTo.push(this.get(v1));
							this.check(e1,writeTo);
							writeTo.pop();
							break;
						default:
							hxsl.Tools.iter(e,(function(f,a1) {
								return function(e2) {
									return f(e2,a1);
								};
							})($bind(this,this.check),writeTo));
						}
						break;
					default:
						hxsl.Tools.iter(e,(function(f,a1) {
							return function(e2) {
								return f(e2,a1);
							};
						})($bind(this,this.check),writeTo));
					}
					break;
				case 20:
					switch(_g[3].e[1]) {
					case 1:
						var e1 = _g[4];
						var v1 = _g[3].e[2];
						writeTo.push(this.get(v1));
						this.check(e1,writeTo);
						writeTo.pop();
						break;
					case 9:
						switch(_g[3].e[2].e[1]) {
						case 1:
							var e1 = _g[4];
							var v1 = _g[3].e[2].e[2];
							writeTo.push(this.get(v1));
							this.check(e1,writeTo);
							writeTo.pop();
							break;
						default:
							hxsl.Tools.iter(e,(function(f,a1) {
								return function(e2) {
									return f(e2,a1);
								};
							})($bind(this,this.check),writeTo));
						}
						break;
					default:
						hxsl.Tools.iter(e,(function(f,a1) {
							return function(e2) {
								return f(e2,a1);
							};
						})($bind(this,this.check),writeTo));
					}
					break;
				default:
					hxsl.Tools.iter(e,(function(f,a1) {
						return function(e2) {
							return f(e2,a1);
						};
					})($bind(this,this.check),writeTo));
				}
				break;
			case 7:
				var init = _g[3];
				var v2 = _g[2];
				if(init != null) {
					writeTo.push(this.get(v2));
					this.check(init,writeTo);
					writeTo.pop();
				} else hxsl.Tools.iter(e,(function(f,a1) {
					return function(e2) {
						return f(e2,a1);
					};
				})($bind(this,this.check),writeTo));
				break;
			case 10:
				var eelse = _g[4];
				var eif = _g[3];
				var e3 = _g[2];
				if(this.hasDiscard(eif) || eelse != null && this.hasDiscard(eelse)) {
					writeTo.push(null);
					this.check(e3,writeTo);
					writeTo.pop();
					this.check(eif,writeTo);
					if(eelse != null) this.check(eelse,writeTo);
				} else hxsl.Tools.iter(e,(function(f,a1) {
					return function(e2) {
						return f(e2,a1);
					};
				})($bind(this,this.check),writeTo));
				break;
			default:
				hxsl.Tools.iter(e,(function(f,a1) {
					return function(e2) {
						return f(e2,a1);
					};
				})($bind(this,this.check),writeTo));
			}
		}
	}
	,mapExpr: function(e) {
		{
			var _g = e.e;
			switch(_g[1]) {
			case 4:
				var el = _g[2];
				var out = [];
				var count = 0;
				var _g1 = 0;
				while(_g1 < el.length) {
					var e1 = el[_g1];
					++_g1;
					var e2 = this.mapExpr(e1);
					{
						var _g2 = e2.e;
						switch(_g2[1]) {
						case 0:
							if(count < el.length) {
							} else out.push(e2);
							break;
						default:
							out.push(e2);
						}
					}
					count++;
				}
				return { e : hxsl.TExprDef.TBlock(out), p : e.p, t : e.t};
			case 7:
				var v = _g[2];
				if(!this.get(v).used) return { e : hxsl.TExprDef.TConst(hxsl.Const.CNull), t : e.t, p : e.p}; else return hxsl.Tools.map(e,$bind(this,this.mapExpr));
				break;
			case 5:
				switch(_g[2][1]) {
				case 4:
					switch(_g[3].e[1]) {
					case 1:
						var v = _g[3].e[2];
						if(!this.get(v).used) return { e : hxsl.TExprDef.TConst(hxsl.Const.CNull), t : e.t, p : e.p}; else return hxsl.Tools.map(e,$bind(this,this.mapExpr));
						break;
					case 9:
						switch(_g[3].e[2].e[1]) {
						case 1:
							var v = _g[3].e[2].e[2];
							if(!this.get(v).used) return { e : hxsl.TExprDef.TConst(hxsl.Const.CNull), t : e.t, p : e.p}; else return hxsl.Tools.map(e,$bind(this,this.mapExpr));
							break;
						default:
							return hxsl.Tools.map(e,$bind(this,this.mapExpr));
						}
						break;
					default:
						return hxsl.Tools.map(e,$bind(this,this.mapExpr));
					}
					break;
				case 20:
					switch(_g[3].e[1]) {
					case 1:
						var v = _g[3].e[2];
						if(!this.get(v).used) return { e : hxsl.TExprDef.TConst(hxsl.Const.CNull), t : e.t, p : e.p}; else return hxsl.Tools.map(e,$bind(this,this.mapExpr));
						break;
					case 9:
						switch(_g[3].e[2].e[1]) {
						case 1:
							var v = _g[3].e[2].e[2];
							if(!this.get(v).used) return { e : hxsl.TExprDef.TConst(hxsl.Const.CNull), t : e.t, p : e.p}; else return hxsl.Tools.map(e,$bind(this,this.mapExpr));
							break;
						default:
							return hxsl.Tools.map(e,$bind(this,this.mapExpr));
						}
						break;
					default:
						return hxsl.Tools.map(e,$bind(this,this.mapExpr));
					}
					break;
				default:
					return hxsl.Tools.map(e,$bind(this,this.mapExpr));
				}
				break;
			default:
				return hxsl.Tools.map(e,$bind(this,this.mapExpr));
			}
		}
	}
	,__class__: hxsl.Dce
};
hxsl.Eval = function() {
	this.varMap = new haxe.ds.ObjectMap();
	this.funMap = new haxe.ds.ObjectMap();
	this.constants = new haxe.ds.ObjectMap();
};
$hxClasses["hxsl.Eval"] = hxsl.Eval;
hxsl.Eval.__name__ = true;
hxsl.Eval.prototype = {
	setConstant: function(v,c) {
		var value = hxsl.TExprDef.TConst(c);
		this.constants.set(v,value);
	}
	,mapVar: function(v) {
		var v2 = this.varMap.h[v.__id__];
		if(v2 != null) return v2;
		v2 = { id : hxsl.Tools.allocVarId(), name : v.name, type : v.type, kind : v.kind};
		if(v.parent != null) v2.parent = this.mapVar(v.parent);
		if(v.qualifiers != null) v2.qualifiers = v.qualifiers.slice();
		this.varMap.set(v,v2);
		this.varMap.set(v2,v2);
		{
			var _g = v2.type;
			switch(_g[1]) {
			case 12:
				var vl = _g[2];
				v2.type = hxsl.Type.TStruct((function($this) {
					var $r;
					var _g1 = [];
					{
						var _g2 = 0;
						while(_g2 < vl.length) {
							var v1 = vl[_g2];
							++_g2;
							_g1.push($this.mapVar(v1));
						}
					}
					$r = _g1;
					return $r;
				}(this)));
				break;
			case 14:
				switch(_g[3][1]) {
				case 1:
					var t = _g[2];
					var vs = _g[3][2];
					var c = this.constants.h[vs.__id__];
					if(c != null) switch(c[1]) {
					case 0:
						switch(c[2][1]) {
						case 2:
							var v3 = c[2][2];
							v2.type = hxsl.Type.TArray(t,hxsl.SizeDecl.SConst(v3));
							break;
						default:
							hxsl.Error.t("Integer value expected for array size constant " + vs.name,null);
						}
						break;
					default:
						hxsl.Error.t("Integer value expected for array size constant " + vs.name,null);
					} else {
						var vs2 = this.mapVar(vs);
						v2.type = hxsl.Type.TArray(t,hxsl.SizeDecl.SVar(vs2));
					}
					break;
				default:
				}
				break;
			default:
			}
		}
		return v2;
	}
	,'eval': function(s) {
		var funs = [];
		var _g = 0;
		var _g1 = s.funs;
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			var f2 = { kind : f.kind, ref : this.mapVar(f.ref), args : (function($this) {
				var $r;
				var _g2 = [];
				{
					var _g3 = 0;
					var _g4 = f.args;
					while(_g3 < _g4.length) {
						var a = _g4[_g3];
						++_g3;
						_g2.push($this.mapVar(a));
					}
				}
				$r = _g2;
				return $r;
			}(this)), ret : f.ret, expr : f.expr};
			if(f.kind != hxsl.FunctionKind.Helper) funs.push(f2);
			this.funMap.set(f2.ref,f2);
		}
		var _g11 = 0;
		var _g5 = funs.length;
		while(_g11 < _g5) {
			var i = _g11++;
			funs[i].expr = this.evalExpr(funs[i].expr);
		}
		return { name : s.name, vars : (function($this) {
			var $r;
			var _g6 = [];
			{
				var _g12 = 0;
				var _g21 = s.vars;
				while(_g12 < _g21.length) {
					var v = _g21[_g12];
					++_g12;
					_g6.push($this.mapVar(v));
				}
			}
			$r = _g6;
			return $r;
		}(this)), funs : funs};
	}
	,hasReturn: function(e) {
		this.markReturn = false;
		this.hasReturnLoop(e);
		return this.markReturn;
	}
	,hasReturnLoop: function(e) {
		{
			var _g = e.e;
			switch(_g[1]) {
			case 12:
				this.markReturn = true;
				break;
			default:
				if(!this.markReturn) hxsl.Tools.iter(e,$bind(this,this.hasReturnLoop));
			}
		}
	}
	,handleReturn: function(e,$final) {
		if($final == null) $final = false;
		{
			var _g = e.e;
			switch(_g[1]) {
			case 12:
				var v = _g[2];
				if(!$final) hxsl.Error.t("Cannot inline not final return",e.p);
				if(v == null) return { e : hxsl.TExprDef.TBlock([]), t : hxsl.Type.TVoid, p : e.p};
				return this.handleReturn(v,true);
			case 4:
				var el = _g[2];
				var i = 0;
				var last = el.length;
				var out = [];
				try {
					while(i < last) {
						var e1 = el[i++];
						if(i == last) out.push(this.handleReturn(e1,$final)); else {
							var _g1 = e1.e;
							switch(_g1[1]) {
							case 10:
								if(_g1[4] == null) {
									var econd = _g1[2];
									var eif = _g1[3];
									if($final && this.hasReturn(eif)) {
										out.push(this.handleReturn({ e : hxsl.TExprDef.TIf(econd,eif,{ e : hxsl.TExprDef.TBlock(el.slice(i)), t : e1.t, p : e1.p}), t : e1.t, p : e1.p}));
										throw "__break__";
									} else out.push(this.handleReturn(e1));
								} else switch(_g1[4]) {
								default:
									out.push(this.handleReturn(e1));
								}
								break;
							default:
								out.push(this.handleReturn(e1));
							}
						}
					}
				} catch( e ) { if( e != "__break__" ) throw e; }
				var t;
				if($final) t = out[out.length - 1].t; else t = e.t;
				return { e : hxsl.TExprDef.TBlock(out), t : t, p : e.p};
			case 3:
				var v1 = _g[2];
				var v2 = this.handleReturn(v1,$final);
				return { e : hxsl.TExprDef.TParenthesis(v2), t : v2.t, p : e.p};
			case 10:
				var eelse = _g[4];
				var eif1 = _g[3];
				var cond = _g[2];
				if(eelse != null && $final) {
					var cond1 = this.handleReturn(cond);
					var eif2 = this.handleReturn(eif1,$final);
					return { e : hxsl.TExprDef.TIf(cond1,eif2,this.handleReturn(eelse,$final)), t : eif2.t, p : e.p};
				} else return hxsl.Tools.map(e,$bind(this,this.handleReturnDef));
				break;
			default:
				return hxsl.Tools.map(e,$bind(this,this.handleReturnDef));
			}
		}
	}
	,handleReturnDef: function(e) {
		return this.handleReturn(e);
	}
	,evalCall: function(g,args) {
		switch(g[1]) {
		case 35:
			switch(args.length) {
			case 1:
				switch(args[0].e[1]) {
				case 0:
					switch(args[0].e[2][1]) {
					case 2:
						var i = args[0].e[2][2];
						return hxsl.TExprDef.TConst(hxsl.Const.CFloat(i));
					default:
						return null;
					}
					break;
				default:
					return null;
				}
				break;
			default:
				return null;
			}
			break;
		default:
			return null;
		}
	}
	,evalExpr: function(e) {
		var _g6 = this;
		var d;
		{
			var _g = e.e;
			switch(_g[1]) {
			case 2:case 0:
				d = e.e;
				break;
			case 1:
				var v = _g[2];
				var c = this.constants.h[v.__id__];
				if(c != null) d = c; else d = hxsl.TExprDef.TVar(this.mapVar(v));
				break;
			case 7:
				var init = _g[3];
				var v1 = _g[2];
				d = hxsl.TExprDef.TVarDecl(this.mapVar(v1),init == null?null:this.evalExpr(init));
				break;
			case 16:
				var e2 = _g[3];
				var e1 = _g[2];
				var e11 = this.evalExpr(e1);
				var e21 = this.evalExpr(e2);
				{
					var _g1 = e11.e;
					var _g2 = e21.e;
					switch(_g1[1]) {
					case 17:
						switch(_g2[1]) {
						case 0:
							switch(_g2[2][1]) {
							case 2:
								var el = _g1[2];
								var i = _g2[2][2];
								if(i >= 0 && i < el.length) d = el[i].e; else d = hxsl.TExprDef.TArray(e11,e21);
								break;
							default:
								d = hxsl.TExprDef.TArray(e11,e21);
							}
							break;
						default:
							d = hxsl.TExprDef.TArray(e11,e21);
						}
						break;
					default:
						d = hxsl.TExprDef.TArray(e11,e21);
					}
				}
				break;
			case 9:
				var r = _g[3];
				var e3 = _g[2];
				d = hxsl.TExprDef.TSwiz(this.evalExpr(e3),r.slice());
				break;
			case 12:
				var e4 = _g[2];
				d = hxsl.TExprDef.TReturn(e4 == null?null:this.evalExpr(e4));
				break;
			case 8:
				var args = _g[3];
				var c1 = _g[2];
				var c2 = this.evalExpr(c1);
				var args1;
				var _g11 = [];
				var _g21 = 0;
				while(_g21 < args.length) {
					var a = args[_g21];
					++_g21;
					_g11.push(this.evalExpr(a));
				}
				args1 = _g11;
				{
					var _g22 = c2.e;
					switch(_g22[1]) {
					case 2:
						var g = _g22[2];
						var v2 = this.evalCall(g,args1);
						if(v2 != null) d = v2; else d = hxsl.TExprDef.TCall(c2,args1);
						break;
					case 1:
						var v3 = _g22[2];
						if(this.funMap.h.__keys__[v3.__id__] != null) {
							var f = this.funMap.h[v3.__id__];
							var outExprs = [];
							var undo = [];
							var _g4 = 0;
							var _g3 = f.args.length;
							while(_g4 < _g3) {
								var i1 = _g4++;
								var v4 = [f.args[i1]];
								var e5 = args1[i1];
								{
									var _g5 = e5.e;
									switch(_g5[1]) {
									case 0:
										var old = [this.constants.h[v4[0].__id__]];
										undo.push((function(old,v4) {
											return function() {
												if(old[0] == null) _g6.constants.remove(v4[0]); else _g6.constants.set(v4[0],old[0]);
											};
										})(old,v4));
										this.constants.set(v4[0],e5.e);
										break;
									case 1:
										switch(_g5[2].kind[1]) {
										case 1:case 2:case 0:
											var old = [this.constants.h[v4[0].__id__]];
											undo.push((function(old,v4) {
												return function() {
													if(old[0] == null) _g6.constants.remove(v4[0]); else _g6.constants.set(v4[0],old[0]);
												};
											})(old,v4));
											this.constants.set(v4[0],e5.e);
											break;
										default:
											var old1 = [this.varMap.h[v4[0].__id__]];
											if(old1[0] == null) undo.push((function(v4) {
												return function() {
													_g6.varMap.remove(v4[0]);
												};
											})(v4)); else {
												this.varMap.remove(v4[0]);
												undo.push((function(old1,v4) {
													return function() {
														_g6.varMap.set(v4[0],old1[0]);
													};
												})(old1,v4));
											}
											var v5 = this.mapVar(v4[0]);
											outExprs.push({ e : hxsl.TExprDef.TVarDecl(v5,e5), t : hxsl.Type.TVoid, p : e5.p});
										}
										break;
									default:
										var old1 = [this.varMap.h[v4[0].__id__]];
										if(old1[0] == null) undo.push((function(v4) {
											return function() {
												_g6.varMap.remove(v4[0]);
											};
										})(v4)); else {
											this.varMap.remove(v4[0]);
											undo.push((function(old1,v4) {
												return function() {
													_g6.varMap.set(v4[0],old1[0]);
												};
											})(old1,v4));
										}
										var v5 = this.mapVar(v4[0]);
										outExprs.push({ e : hxsl.TExprDef.TVarDecl(v5,e5), t : hxsl.Type.TVoid, p : e5.p});
									}
								}
							}
							var e6 = this.handleReturn(this.evalExpr(f.expr),true);
							var _g31 = 0;
							while(_g31 < undo.length) {
								var u = undo[_g31];
								++_g31;
								u();
							}
							{
								var _g32 = e6.e;
								switch(_g32[1]) {
								case 4:
									var el1 = _g32[2];
									var _g41 = 0;
									while(_g41 < el1.length) {
										var e7 = el1[_g41];
										++_g41;
										outExprs.push(e7);
									}
									break;
								default:
									outExprs.push(e6);
								}
							}
							d = hxsl.TExprDef.TBlock(outExprs);
						} else d = hxsl.Error.t("Cannot eval non-static call expresssion '" + new hxsl.Printer().exprString(c2) + "'",c2.p);
						break;
					default:
						d = hxsl.Error.t("Cannot eval non-static call expresssion '" + new hxsl.Printer().exprString(c2) + "'",c2.p);
					}
				}
				break;
			case 4:
				var el2 = _g[2];
				var out = [];
				var last = el2.length - 1;
				var _g23 = 0;
				var _g12 = el2.length;
				while(_g23 < _g12) {
					var i2 = _g23++;
					var e8 = this.evalExpr(el2[i2]);
					{
						var _g33 = e8.e;
						switch(_g33[1]) {
						case 0:
							if(i2 < last) {
							} else out.push(e8);
							break;
						case 1:
							if(i2 < last) {
							} else out.push(e8);
							break;
						default:
							out.push(e8);
						}
					}
				}
				if(out.length == 1) d = out[0].e; else d = hxsl.TExprDef.TBlock(out);
				break;
			case 5:
				var e22 = _g[4];
				var e12 = _g[3];
				var op = _g[2];
				var e13 = this.evalExpr(e12);
				var e23 = this.evalExpr(e22);
				switch(op[1]) {
				case 0:
					{
						var _g13 = e13.e;
						var _g24 = e23.e;
						switch(_g13[1]) {
						case 0:
							switch(_g13[2][1]) {
							case 2:
								switch(_g24[1]) {
								case 0:
									switch(_g24[2][1]) {
									case 2:
										var a1 = _g13[2][2];
										var b = _g24[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CInt(Std["int"](a1 + b)));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 3:
								switch(_g24[1]) {
								case 0:
									switch(_g24[2][1]) {
									case 3:
										var a2 = _g13[2][2];
										var b1 = _g24[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CFloat(a2 + b1));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							default:
								d = hxsl.TExprDef.TBinop(op,e13,e23);
							}
							break;
						default:
							d = hxsl.TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 3:
					{
						var _g14 = e13.e;
						var _g25 = e23.e;
						switch(_g14[1]) {
						case 0:
							switch(_g14[2][1]) {
							case 2:
								switch(_g25[1]) {
								case 0:
									switch(_g25[2][1]) {
									case 2:
										var a3 = _g14[2][2];
										var b2 = _g25[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CInt(Std["int"](a3 - b2)));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 3:
								switch(_g25[1]) {
								case 0:
									switch(_g25[2][1]) {
									case 3:
										var a4 = _g14[2][2];
										var b3 = _g25[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CFloat(a4 - b3));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							default:
								d = hxsl.TExprDef.TBinop(op,e13,e23);
							}
							break;
						default:
							d = hxsl.TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 1:
					{
						var _g15 = e13.e;
						var _g26 = e23.e;
						switch(_g15[1]) {
						case 0:
							switch(_g15[2][1]) {
							case 2:
								switch(_g26[1]) {
								case 0:
									switch(_g26[2][1]) {
									case 2:
										var a5 = _g15[2][2];
										var b4 = _g26[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CInt(Std["int"](a5 * b4)));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 3:
								switch(_g26[1]) {
								case 0:
									switch(_g26[2][1]) {
									case 3:
										var a6 = _g15[2][2];
										var b5 = _g26[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CFloat(a6 * b5));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							default:
								d = hxsl.TExprDef.TBinop(op,e13,e23);
							}
							break;
						default:
							d = hxsl.TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 2:
					{
						var _g16 = e13.e;
						var _g27 = e23.e;
						switch(_g16[1]) {
						case 0:
							switch(_g16[2][1]) {
							case 2:
								switch(_g27[1]) {
								case 0:
									switch(_g27[2][1]) {
									case 2:
										var a7 = _g16[2][2];
										var b6 = _g27[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CInt(Std["int"](a7 / b6)));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 3:
								switch(_g27[1]) {
								case 0:
									switch(_g27[2][1]) {
									case 3:
										var a8 = _g16[2][2];
										var b7 = _g27[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CFloat(a8 / b7));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							default:
								d = hxsl.TExprDef.TBinop(op,e13,e23);
							}
							break;
						default:
							d = hxsl.TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 19:
					{
						var _g17 = e13.e;
						var _g28 = e23.e;
						switch(_g17[1]) {
						case 0:
							switch(_g17[2][1]) {
							case 2:
								switch(_g28[1]) {
								case 0:
									switch(_g28[2][1]) {
									case 2:
										var a9 = _g17[2][2];
										var b8 = _g28[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CInt(Std["int"](a9 % b8)));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 3:
								switch(_g28[1]) {
								case 0:
									switch(_g28[2][1]) {
									case 3:
										var a10 = _g17[2][2];
										var b9 = _g28[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CFloat(a10 % b9));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							default:
								d = hxsl.TExprDef.TBinop(op,e13,e23);
							}
							break;
						default:
							d = hxsl.TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 13:
					{
						var _g18 = e13.e;
						var _g29 = e23.e;
						switch(_g18[1]) {
						case 0:
							switch(_g18[2][1]) {
							case 2:
								switch(_g29[1]) {
								case 0:
									switch(_g29[2][1]) {
									case 2:
										var a11 = _g18[2][2];
										var b10 = _g29[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CInt(a11 ^ b10));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							default:
								d = hxsl.TExprDef.TBinop(op,e13,e23);
							}
							break;
						default:
							d = hxsl.TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 12:
					{
						var _g19 = e13.e;
						var _g210 = e23.e;
						switch(_g19[1]) {
						case 0:
							switch(_g19[2][1]) {
							case 2:
								switch(_g210[1]) {
								case 0:
									switch(_g210[2][1]) {
									case 2:
										var a12 = _g19[2][2];
										var b11 = _g210[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CInt(a12 | b11));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							default:
								d = hxsl.TExprDef.TBinop(op,e13,e23);
							}
							break;
						default:
							d = hxsl.TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 11:
					{
						var _g110 = e13.e;
						var _g211 = e23.e;
						switch(_g110[1]) {
						case 0:
							switch(_g110[2][1]) {
							case 2:
								switch(_g211[1]) {
								case 0:
									switch(_g211[2][1]) {
									case 2:
										var a13 = _g110[2][2];
										var b12 = _g211[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CInt(a13 & b12));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							default:
								d = hxsl.TExprDef.TBinop(op,e13,e23);
							}
							break;
						default:
							d = hxsl.TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 17:
					{
						var _g111 = e13.e;
						var _g212 = e23.e;
						switch(_g111[1]) {
						case 0:
							switch(_g111[2][1]) {
							case 2:
								switch(_g212[1]) {
								case 0:
									switch(_g212[2][1]) {
									case 2:
										var a14 = _g111[2][2];
										var b13 = _g212[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CInt(a14 >> b13));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							default:
								d = hxsl.TExprDef.TBinop(op,e13,e23);
							}
							break;
						default:
							d = hxsl.TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 18:
					{
						var _g112 = e13.e;
						var _g213 = e23.e;
						switch(_g112[1]) {
						case 0:
							switch(_g112[2][1]) {
							case 2:
								switch(_g213[1]) {
								case 0:
									switch(_g213[2][1]) {
									case 2:
										var a15 = _g112[2][2];
										var b14 = _g213[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CInt(a15 >>> b14));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							default:
								d = hxsl.TExprDef.TBinop(op,e13,e23);
							}
							break;
						default:
							d = hxsl.TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 16:
					{
						var _g113 = e13.e;
						var _g214 = e23.e;
						switch(_g113[1]) {
						case 0:
							switch(_g113[2][1]) {
							case 2:
								switch(_g214[1]) {
								case 0:
									switch(_g214[2][1]) {
									case 2:
										var a16 = _g113[2][2];
										var b15 = _g214[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CInt(a16 << b15));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							default:
								d = hxsl.TExprDef.TBinop(op,e13,e23);
							}
							break;
						default:
							d = hxsl.TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 14:
					{
						var _g114 = e13.e;
						var _g215 = e23.e;
						switch(_g114[1]) {
						case 0:
							switch(_g114[2][1]) {
							case 1:
								switch(_g215[1]) {
								case 0:
									switch(_g215[2][1]) {
									case 1:
										var a17 = _g114[2][2];
										var b16 = _g215[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(a17 && b16));
										break;
									default:
										var a18 = _g114[2][2];
										if(a18 == false) d = hxsl.TExprDef.TConst(hxsl.Const.CBool(a18)); else d = e23.e;
									}
									break;
								default:
									var a18 = _g114[2][2];
									if(a18 == false) d = hxsl.TExprDef.TConst(hxsl.Const.CBool(a18)); else d = e23.e;
								}
								break;
							default:
								switch(_g215[1]) {
								case 0:
									switch(_g215[2][1]) {
									case 1:
										var a19 = _g215[2][2];
										if(a19 == false) d = hxsl.TExprDef.TConst(hxsl.Const.CBool(a19)); else d = e13.e;
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
							}
							break;
						default:
							switch(_g215[1]) {
							case 0:
								switch(_g215[2][1]) {
								case 1:
									var a19 = _g215[2][2];
									if(a19 == false) d = hxsl.TExprDef.TConst(hxsl.Const.CBool(a19)); else d = e13.e;
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							default:
								d = hxsl.TExprDef.TBinop(op,e13,e23);
							}
						}
					}
					break;
				case 15:
					{
						var _g115 = e13.e;
						var _g216 = e23.e;
						switch(_g115[1]) {
						case 0:
							switch(_g115[2][1]) {
							case 1:
								switch(_g216[1]) {
								case 0:
									switch(_g216[2][1]) {
									case 1:
										var a20 = _g115[2][2];
										var b17 = _g216[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(a20 || b17));
										break;
									default:
										var a21 = _g115[2][2];
										if(a21 == true) d = hxsl.TExprDef.TConst(hxsl.Const.CBool(a21)); else d = e23.e;
									}
									break;
								default:
									var a21 = _g115[2][2];
									if(a21 == true) d = hxsl.TExprDef.TConst(hxsl.Const.CBool(a21)); else d = e23.e;
								}
								break;
							default:
								switch(_g216[1]) {
								case 0:
									switch(_g216[2][1]) {
									case 1:
										var a22 = _g216[2][2];
										if(a22 == true) d = hxsl.TExprDef.TConst(hxsl.Const.CBool(a22)); else d = e13.e;
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
							}
							break;
						default:
							switch(_g216[1]) {
							case 0:
								switch(_g216[2][1]) {
								case 1:
									var a22 = _g216[2][2];
									if(a22 == true) d = hxsl.TExprDef.TConst(hxsl.Const.CBool(a22)); else d = e13.e;
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							default:
								d = hxsl.TExprDef.TBinop(op,e13,e23);
							}
						}
					}
					break;
				case 5:
					{
						var _g116 = e13.e;
						var _g217 = e23.e;
						switch(_g116[1]) {
						case 0:
							switch(_g116[2][1]) {
							case 0:
								switch(_g217[1]) {
								case 0:
									switch(_g217[2][1]) {
									case 0:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(true));
										break;
									default:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(false));
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 1:
								switch(_g217[1]) {
								case 0:
									switch(_g217[2][1]) {
									case 0:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(false));
										break;
									case 1:
										var a23 = _g116[2][2];
										var b18 = _g217[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool((a23 == b18?0:1) == 0));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 2:
								switch(_g217[1]) {
								case 0:
									switch(_g217[2][1]) {
									case 0:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(false));
										break;
									case 2:
										var a24 = _g116[2][2];
										var b19 = _g217[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(a24 - b19 == 0));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 3:
								switch(_g217[1]) {
								case 0:
									switch(_g217[2][1]) {
									case 0:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(false));
										break;
									case 3:
										var a25 = _g116[2][2];
										var b20 = _g217[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool((a25 > b20?1:a25 == b20?0:-1) == 0));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 4:
								switch(_g217[1]) {
								case 0:
									switch(_g217[2][1]) {
									case 0:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(false));
										break;
									case 4:
										var a26 = _g116[2][2];
										var b21 = _g217[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool((a26 > b21?1:a26 == b21?0:-1) == 0));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							}
							break;
						default:
							d = hxsl.TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 6:
					{
						var _g117 = e13.e;
						var _g218 = e23.e;
						switch(_g117[1]) {
						case 0:
							switch(_g117[2][1]) {
							case 0:
								switch(_g218[1]) {
								case 0:
									switch(_g218[2][1]) {
									case 0:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(false));
										break;
									default:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(true));
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 1:
								switch(_g218[1]) {
								case 0:
									switch(_g218[2][1]) {
									case 0:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(true));
										break;
									case 1:
										var a27 = _g117[2][2];
										var b22 = _g218[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool((a27 == b22?0:1) != 0));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 2:
								switch(_g218[1]) {
								case 0:
									switch(_g218[2][1]) {
									case 0:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(true));
										break;
									case 2:
										var a28 = _g117[2][2];
										var b23 = _g218[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(a28 - b23 != 0));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 3:
								switch(_g218[1]) {
								case 0:
									switch(_g218[2][1]) {
									case 0:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(true));
										break;
									case 3:
										var a29 = _g117[2][2];
										var b24 = _g218[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool((a29 > b24?1:a29 == b24?0:-1) != 0));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 4:
								switch(_g218[1]) {
								case 0:
									switch(_g218[2][1]) {
									case 0:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(true));
										break;
									case 4:
										var a30 = _g117[2][2];
										var b25 = _g218[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool((a30 > b25?1:a30 == b25?0:-1) != 0));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							}
							break;
						default:
							d = hxsl.TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 7:
					{
						var _g118 = e13.e;
						var _g219 = e23.e;
						switch(_g118[1]) {
						case 0:
							switch(_g118[2][1]) {
							case 0:
								switch(_g219[1]) {
								case 0:
									switch(_g219[2][1]) {
									case 0:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(false));
										break;
									default:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(false));
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 1:
								switch(_g219[1]) {
								case 0:
									switch(_g219[2][1]) {
									case 0:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(true));
										break;
									case 1:
										var a31 = _g118[2][2];
										var b26 = _g219[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool((a31 == b26?0:1) > 0));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 2:
								switch(_g219[1]) {
								case 0:
									switch(_g219[2][1]) {
									case 0:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(true));
										break;
									case 2:
										var a32 = _g118[2][2];
										var b27 = _g219[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(a32 - b27 > 0));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 3:
								switch(_g219[1]) {
								case 0:
									switch(_g219[2][1]) {
									case 0:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(true));
										break;
									case 3:
										var a33 = _g118[2][2];
										var b28 = _g219[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool((a33 > b28?1:a33 == b28?0:-1) > 0));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 4:
								switch(_g219[1]) {
								case 0:
									switch(_g219[2][1]) {
									case 0:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(true));
										break;
									case 4:
										var a34 = _g118[2][2];
										var b29 = _g219[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool((a34 > b29?1:a34 == b29?0:-1) > 0));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							}
							break;
						default:
							d = hxsl.TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 8:
					{
						var _g119 = e13.e;
						var _g220 = e23.e;
						switch(_g119[1]) {
						case 0:
							switch(_g119[2][1]) {
							case 0:
								switch(_g220[1]) {
								case 0:
									switch(_g220[2][1]) {
									case 0:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(true));
										break;
									default:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(false));
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 1:
								switch(_g220[1]) {
								case 0:
									switch(_g220[2][1]) {
									case 0:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(true));
										break;
									case 1:
										var a35 = _g119[2][2];
										var b30 = _g220[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool((a35 == b30?0:1) >= 0));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 2:
								switch(_g220[1]) {
								case 0:
									switch(_g220[2][1]) {
									case 0:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(true));
										break;
									case 2:
										var a36 = _g119[2][2];
										var b31 = _g220[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(a36 - b31 >= 0));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 3:
								switch(_g220[1]) {
								case 0:
									switch(_g220[2][1]) {
									case 0:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(true));
										break;
									case 3:
										var a37 = _g119[2][2];
										var b32 = _g220[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool((a37 > b32?1:a37 == b32?0:-1) >= 0));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 4:
								switch(_g220[1]) {
								case 0:
									switch(_g220[2][1]) {
									case 0:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(true));
										break;
									case 4:
										var a38 = _g119[2][2];
										var b33 = _g220[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool((a38 > b33?1:a38 == b33?0:-1) >= 0));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							}
							break;
						default:
							d = hxsl.TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 9:
					{
						var _g120 = e13.e;
						var _g221 = e23.e;
						switch(_g120[1]) {
						case 0:
							switch(_g120[2][1]) {
							case 0:
								switch(_g221[1]) {
								case 0:
									switch(_g221[2][1]) {
									case 0:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(false));
										break;
									default:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(true));
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 1:
								switch(_g221[1]) {
								case 0:
									switch(_g221[2][1]) {
									case 0:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(false));
										break;
									case 1:
										var a39 = _g120[2][2];
										var b34 = _g221[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool((a39 == b34?0:1) < 0));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 2:
								switch(_g221[1]) {
								case 0:
									switch(_g221[2][1]) {
									case 0:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(false));
										break;
									case 2:
										var a40 = _g120[2][2];
										var b35 = _g221[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(a40 - b35 < 0));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 3:
								switch(_g221[1]) {
								case 0:
									switch(_g221[2][1]) {
									case 0:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(false));
										break;
									case 3:
										var a41 = _g120[2][2];
										var b36 = _g221[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool((a41 > b36?1:a41 == b36?0:-1) < 0));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 4:
								switch(_g221[1]) {
								case 0:
									switch(_g221[2][1]) {
									case 0:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(false));
										break;
									case 4:
										var a42 = _g120[2][2];
										var b37 = _g221[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool((a42 > b37?1:a42 == b37?0:-1) < 0));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							}
							break;
						default:
							d = hxsl.TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 10:
					{
						var _g121 = e13.e;
						var _g222 = e23.e;
						switch(_g121[1]) {
						case 0:
							switch(_g121[2][1]) {
							case 0:
								switch(_g222[1]) {
								case 0:
									switch(_g222[2][1]) {
									case 0:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(true));
										break;
									default:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(true));
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 1:
								switch(_g222[1]) {
								case 0:
									switch(_g222[2][1]) {
									case 0:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(false));
										break;
									case 1:
										var a43 = _g121[2][2];
										var b38 = _g222[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool((a43 == b38?0:1) <= 0));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 2:
								switch(_g222[1]) {
								case 0:
									switch(_g222[2][1]) {
									case 0:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(false));
										break;
									case 2:
										var a44 = _g121[2][2];
										var b39 = _g222[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(a44 - b39 <= 0));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 3:
								switch(_g222[1]) {
								case 0:
									switch(_g222[2][1]) {
									case 0:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(false));
										break;
									case 3:
										var a45 = _g121[2][2];
										var b40 = _g222[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool((a45 > b40?1:a45 == b40?0:-1) <= 0));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 4:
								switch(_g222[1]) {
								case 0:
									switch(_g222[2][1]) {
									case 0:
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool(false));
										break;
									case 4:
										var a46 = _g121[2][2];
										var b41 = _g222[2][2];
										d = hxsl.TExprDef.TConst(hxsl.Const.CBool((a46 > b41?1:a46 == b41?0:-1) <= 0));
										break;
									default:
										d = hxsl.TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl.TExprDef.TBinop(op,e13,e23);
								}
								break;
							}
							break;
						default:
							d = hxsl.TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 21:case 4:case 20:
					d = hxsl.TExprDef.TBinop(op,e13,e23);
					break;
				case 22:
					throw "assert";
					break;
				}
				break;
			case 6:
				var e9 = _g[3];
				var op1 = _g[2];
				var e10 = this.evalExpr(e9);
				{
					var _g122 = e10.e;
					switch(_g122[1]) {
					case 0:
						var c3 = _g122[2];
						switch(op1[1]) {
						case 2:
							switch(c3[1]) {
							case 1:
								var b42 = c3[2];
								d = hxsl.TExprDef.TConst(hxsl.Const.CBool(!b42));
								break;
							default:
								d = hxsl.TExprDef.TUnop(op1,e10);
							}
							break;
						case 3:
							switch(c3[1]) {
							case 2:
								var i3 = c3[2];
								d = hxsl.TExprDef.TConst(hxsl.Const.CInt(-i3));
								break;
							case 3:
								var f1 = c3[2];
								d = hxsl.TExprDef.TConst(hxsl.Const.CFloat(-f1));
								break;
							default:
								d = hxsl.TExprDef.TUnop(op1,e10);
							}
							break;
						default:
							d = hxsl.TExprDef.TUnop(op1,e10);
						}
						break;
					default:
						d = hxsl.TExprDef.TUnop(op1,e10);
					}
				}
				break;
			case 3:
				var e14 = _g[2];
				var e15 = this.evalExpr(e14);
				{
					var _g123 = e15.e;
					switch(_g123[1]) {
					case 0:
						d = e15.e;
						break;
					default:
						d = hxsl.TExprDef.TParenthesis(e15);
					}
				}
				break;
			case 10:
				var eelse = _g[4];
				var eif = _g[3];
				var econd = _g[2];
				var e16 = this.evalExpr(econd);
				{
					var _g124 = e16.e;
					switch(_g124[1]) {
					case 0:
						switch(_g124[2][1]) {
						case 1:
							var b43 = _g124[2][2];
							if(b43) return this.evalExpr(eif); else if(eelse == null) return { e : hxsl.TExprDef.TConst(hxsl.Const.CNull), t : hxsl.Type.TVoid, p : e16.p}; else return this.evalExpr(eelse);
							break;
						default:
							d = hxsl.TExprDef.TIf(e16,this.evalExpr(eif),eelse == null?null:this.evalExpr(eelse));
						}
						break;
					default:
						d = hxsl.TExprDef.TIf(e16,this.evalExpr(eif),eelse == null?null:this.evalExpr(eelse));
					}
				}
				break;
			case 15:
				d = hxsl.TExprDef.TBreak;
				break;
			case 14:
				d = hxsl.TExprDef.TContinue;
				break;
			case 11:
				d = hxsl.TExprDef.TDiscard;
				break;
			case 13:
				var loop = _g[4];
				var it = _g[3];
				var v6 = _g[2];
				var v21 = this.mapVar(v6);
				var it1 = this.evalExpr(it);
				var e17;
				{
					var _g125 = it1.e;
					switch(_g125[1]) {
					case 5:
						switch(_g125[2][1]) {
						case 21:
							switch(_g125[3].e[1]) {
							case 0:
								switch(_g125[3].e[2][1]) {
								case 2:
									switch(_g125[4].e[1]) {
									case 0:
										switch(_g125[4].e[2][1]) {
										case 2:
											var start = _g125[3].e[2][2];
											var len = _g125[4].e[2][2];
											var out1 = [];
											var _g223 = start;
											while(_g223 < len) {
												var i4 = _g223++;
												var value = hxsl.TExprDef.TConst(hxsl.Const.CInt(i4));
												this.constants.set(v6,value);
												out1.push(this.evalExpr(loop));
											}
											this.constants.remove(v6);
											e17 = hxsl.TExprDef.TBlock(out1);
											break;
										default:
											e17 = hxsl.TExprDef.TFor(v21,it1,this.evalExpr(loop));
										}
										break;
									default:
										e17 = hxsl.TExprDef.TFor(v21,it1,this.evalExpr(loop));
									}
									break;
								default:
									e17 = hxsl.TExprDef.TFor(v21,it1,this.evalExpr(loop));
								}
								break;
							default:
								e17 = hxsl.TExprDef.TFor(v21,it1,this.evalExpr(loop));
							}
							break;
						default:
							e17 = hxsl.TExprDef.TFor(v21,it1,this.evalExpr(loop));
						}
						break;
					default:
						e17 = hxsl.TExprDef.TFor(v21,it1,this.evalExpr(loop));
					}
				}
				this.varMap.remove(v6);
				d = e17;
				break;
			case 17:
				var el3 = _g[2];
				d = hxsl.TExprDef.TArrayDecl((function($this) {
					var $r;
					var _g126 = [];
					{
						var _g224 = 0;
						while(_g224 < el3.length) {
							var e18 = el3[_g224];
							++_g224;
							_g126.push($this.evalExpr(e18));
						}
					}
					$r = _g126;
					return $r;
				}(this)));
				break;
			}
		}
		return { e : d, t : e.t, p : e.p};
	}
	,__class__: hxsl.Eval
};
hxsl._Flatten = {};
hxsl._Flatten.Alloc = function(g,t,pos,size) {
	this.g = g;
	this.t = t;
	this.pos = pos;
	this.size = size;
};
$hxClasses["hxsl._Flatten.Alloc"] = hxsl._Flatten.Alloc;
hxsl._Flatten.Alloc.__name__ = true;
hxsl._Flatten.Alloc.prototype = {
	__class__: hxsl._Flatten.Alloc
};
hxsl.Flatten = function() {
};
$hxClasses["hxsl.Flatten"] = hxsl.Flatten;
hxsl.Flatten.__name__ = true;
hxsl.Flatten.prototype = {
	flatten: function(s,kind,constsToGlobal) {
		this.globals = [];
		this.params = [];
		this.outVars = [];
		if(constsToGlobal) {
			this.consts = [];
			var p = s.funs[0].expr.p;
			var gc = { id : hxsl.Tools.allocVarId(), name : "__consts__", kind : hxsl.VarKind.Global, type : null};
			this.econsts = { e : hxsl.TExprDef.TVar(gc), t : null, p : p};
			s = { name : s.name, vars : s.vars.slice(), funs : (function($this) {
				var $r;
				var _g = [];
				{
					var _g1 = 0;
					var _g2 = s.funs;
					while(_g1 < _g2.length) {
						var f = _g2[_g1];
						++_g1;
						_g.push($this.mapFun(f,$bind($this,$this.mapConsts)));
					}
				}
				$r = _g;
				return $r;
			}(this))};
			var _g11 = 0;
			var _g21 = s.vars;
			while(_g11 < _g21.length) {
				var v = _g21[_g11];
				++_g11;
				{
					var _g3 = v.type;
					switch(_g3[1]) {
					case 9:
						this.allocConst(255,p);
						break;
					default:
					}
				}
			}
			if(this.consts.length > 0) {
				gc.type = this.econsts.t = hxsl.Type.TArray(hxsl.Type.TFloat,hxsl.SizeDecl.SConst(this.consts.length));
				s.vars.push(gc);
			}
		}
		this.varMap = new haxe.ds.ObjectMap();
		this.allocData = new haxe.ds.ObjectMap();
		var _g4 = 0;
		var _g12 = s.vars;
		while(_g4 < _g12.length) {
			var v1 = _g12[_g4];
			++_g4;
			this.gatherVar(v1);
		}
		var prefix;
		switch(kind[1]) {
		case 0:
			prefix = "vertex";
			break;
		case 1:
			prefix = "fragment";
			break;
		default:
			throw "assert";
		}
		this.pack(prefix + "Globals",hxsl.VarKind.Global,this.globals,hxsl.VecType.VFloat);
		this.pack(prefix + "Params",hxsl.VarKind.Param,this.params,hxsl.VecType.VFloat);
		this.packTextures(prefix + "Textures",this.globals.concat(this.params),hxsl.Type.TSampler2D);
		return { name : s.name, vars : this.outVars, funs : (function($this) {
			var $r;
			var _g5 = [];
			{
				var _g13 = 0;
				var _g22 = s.funs;
				while(_g13 < _g22.length) {
					var f1 = _g22[_g13];
					++_g13;
					_g5.push($this.mapFun(f1,$bind($this,$this.mapExpr)));
				}
			}
			$r = _g5;
			return $r;
		}(this))};
	}
	,mapFun: function(f,mapExpr) {
		return { kind : f.kind, ret : f.ret, args : f.args, ref : f.ref, expr : mapExpr(f.expr)};
	}
	,mapExpr: function(e) {
		{
			var _g = e.e;
			switch(_g[1]) {
			case 1:
				var v = _g[2];
				var a = this.varMap.h[v.__id__];
				if(a == null) e = e; else e = this.access(a,v.type,e.p,(function(f,a1) {
					return function(a11,a2) {
						return f(a1,a11,a2);
					};
				})($bind(this,this.readIndex),a));
				break;
			case 16:
				switch(_g[2].e[1]) {
				case 1:
					var eindex = _g[3];
					var vp = _g[2].p;
					var v1 = _g[2].e[2];
					if(!(function($this) {
						var $r;
						var _g1 = eindex.e;
						$r = (function($this) {
							var $r;
							switch(_g1[1]) {
							case 0:
								$r = (function($this) {
									var $r;
									switch(_g1[2][1]) {
									case 2:
										$r = true;
										break;
									default:
										$r = false;
									}
									return $r;
								}($this));
								break;
							default:
								$r = false;
							}
							return $r;
						}($this));
						return $r;
					}(this))) {
						var a3 = this.varMap.h[v1.__id__];
						if(a3 == null) e = e; else {
							var _g11 = v1.type;
							switch(_g11[1]) {
							case 14:
								var t = _g11[2];
								var stride = this.varSize(t,a3.t);
								if(stride == 0 || (stride & 3) != 0) throw "assert " + Std.string(t);
								stride >>= 2;
								eindex = this.mapExpr(eindex);
								var toInt = { e : hxsl.TExprDef.TCall({ e : hxsl.TExprDef.TGlobal(hxsl.TGlobal.ToInt), t : hxsl.Type.TFun([]), p : vp},[eindex]), t : hxsl.Type.TInt, p : vp};
								e = this.access(a3,t,vp,(function(f1,a4,a12,a21) {
									return function(a31,a41) {
										return f1(a4,a12,a21,a31,a41);
									};
								})($bind(this,this.readOffset),a3,stride,{ e : hxsl.TExprDef.TBinop(haxe.macro.Binop.OpMult,toInt,{ e : hxsl.TExprDef.TConst(hxsl.Const.CInt(stride)), t : hxsl.Type.TInt, p : vp}), t : hxsl.Type.TInt, p : vp}));
								break;
							default:
								throw "assert";
							}
						}
					} else e = hxsl.Tools.map(e,$bind(this,this.mapExpr));
					break;
				default:
					e = hxsl.Tools.map(e,$bind(this,this.mapExpr));
				}
				break;
			default:
				e = hxsl.Tools.map(e,$bind(this,this.mapExpr));
			}
		}
		return this.optimize(e);
	}
	,mapConsts: function(e) {
		{
			var _g = e.e;
			switch(_g[1]) {
			case 16:
				var eindex = _g[3];
				var eindex1 = _g[3];
				switch(_g[3].e[1]) {
				case 0:
					switch(_g[3].e[2][1]) {
					case 2:
						var ea = _g[2];
						return { e : hxsl.TExprDef.TArray(this.mapConsts(ea),eindex), t : e.t, p : e.p};
					default:
						var ea1 = _g[2];
						{
							var _g1 = ea1.t;
							switch(_g1[1]) {
							case 14:
								var t = _g1[2];
								var stride = this.varSize(t,hxsl.VecType.VFloat) >> 2;
								this.allocConst(stride,e.p);
								break;
							default:
							}
						}
					}
					break;
				default:
					var ea1 = _g[2];
					{
						var _g1 = ea1.t;
						switch(_g1[1]) {
						case 14:
							var t = _g1[2];
							var stride = this.varSize(t,hxsl.VecType.VFloat) >> 2;
							this.allocConst(stride,e.p);
							break;
						default:
						}
					}
				}
				break;
			case 5:
				switch(_g[2][1]) {
				case 1:
					switch(_g[4].t[1]) {
					case 8:
						this.allocConst(1,e.p);
						break;
					default:
					}
					break;
				default:
				}
				break;
			case 0:
				var c = _g[2];
				switch(c[1]) {
				case 3:
					var v = c[2];
					return this.allocConst(v,e.p);
				case 2:
					var v1 = c[2];
					return this.allocConst(v1,e.p);
				default:
					return e;
				}
				break;
			case 2:
				var g = _g[2];
				switch(g[1]) {
				case 51:
					this.allocConsts([1,255,65025,16581375],e.p);
					this.allocConsts([0.00392156862745098,0.00392156862745098,0.00392156862745098,0],e.p);
					break;
				case 52:
					this.allocConsts([1,0.00392156862745098,1.5378700499807768e-005,6.0308629411010845e-008],e.p);
					break;
				default:
				}
				break;
			case 8:
				switch(_g[2].e[1]) {
				case 2:
					switch(_g[2].e[2][1]) {
					case 39:
						switch(_g[3].length) {
						case 2:
							switch(_g[3][0].t[1]) {
							case 5:
								switch(_g[3][0].t[2]) {
								case 3:
									switch(_g[3][0].t[3][1]) {
									case 1:
										switch(_g[3][0].e[1]) {
										case 1:
											switch(_g[3][0].e[2].kind[1]) {
											case 0:case 2:case 1:case 3:
												switch(_g[3][1].e[1]) {
												case 0:
													switch(_g[3][1].e[2][1]) {
													case 2:
														switch(_g[3][1].e[2][2]) {
														case 1:
															return e;
														default:
														}
														break;
													default:
													}
													break;
												default:
												}
												break;
											default:
											}
											break;
										default:
										}
										break;
									default:
									}
									break;
								default:
								}
								break;
							default:
							}
							break;
						default:
						}
						break;
					default:
					}
					break;
				default:
				}
				break;
			default:
			}
		}
		return hxsl.Tools.map(e,$bind(this,this.mapConsts));
	}
	,allocConst: function(v,p) {
		var index = HxOverrides.indexOf(this.consts,v,0);
		if(index < 0) {
			index = this.consts.length;
			this.consts.push(v);
		}
		return { e : hxsl.TExprDef.TArray(this.econsts,{ e : hxsl.TExprDef.TConst(hxsl.Const.CInt(index)), t : hxsl.Type.TInt, p : p}), t : hxsl.Type.TFloat, p : p};
	}
	,allocConsts: function(va,p) {
		var _g = this;
		var pad = va.length - 1 & 3;
		var index = -1;
		var _g1 = 0;
		var _g2 = this.consts.length - (va.length - 1);
		while(_g1 < _g2) {
			var i = _g1++;
			if(i >> 2 != i + pad >> 2) continue;
			var found = true;
			var _g3 = 0;
			var _g21 = va.length;
			while(_g3 < _g21) {
				var j = _g3++;
				if(this.consts[i + j] != va[j]) {
					found = false;
					break;
				}
			}
			if(found) {
				index = i;
				break;
			}
		}
		if(index < 0) {
			while(this.consts.length >> 2 != this.consts.length + pad >> 2) this.consts.push(0);
			index = this.consts.length;
			var _g4 = 0;
			while(_g4 < va.length) {
				var v = va[_g4];
				++_g4;
				this.consts.push(v);
			}
		}
		var _g5 = va.length;
		switch(_g5) {
		case 1:
			return { e : hxsl.TExprDef.TArray(_g.econsts,{ e : hxsl.TExprDef.TConst(hxsl.Const.CInt(index)), t : hxsl.Type.TInt, p : p}), t : hxsl.Type.TFloat, p : p};
		case 2:
			return { e : hxsl.TExprDef.TCall({ e : hxsl.TExprDef.TGlobal(hxsl.TGlobal.Vec2), t : hxsl.Type.TVoid, p : p},[{ e : hxsl.TExprDef.TArray(_g.econsts,{ e : hxsl.TExprDef.TConst(hxsl.Const.CInt(index)), t : hxsl.Type.TInt, p : p}), t : hxsl.Type.TFloat, p : p},{ e : hxsl.TExprDef.TArray(_g.econsts,{ e : hxsl.TExprDef.TConst(hxsl.Const.CInt(index + 1)), t : hxsl.Type.TInt, p : p}), t : hxsl.Type.TFloat, p : p}]), t : hxsl.Type.TVec(2,hxsl.VecType.VFloat), p : p};
		case 3:
			return { e : hxsl.TExprDef.TCall({ e : hxsl.TExprDef.TGlobal(hxsl.TGlobal.Vec3), t : hxsl.Type.TVoid, p : p},[{ e : hxsl.TExprDef.TArray(_g.econsts,{ e : hxsl.TExprDef.TConst(hxsl.Const.CInt(index)), t : hxsl.Type.TInt, p : p}), t : hxsl.Type.TFloat, p : p},{ e : hxsl.TExprDef.TArray(_g.econsts,{ e : hxsl.TExprDef.TConst(hxsl.Const.CInt(index + 1)), t : hxsl.Type.TInt, p : p}), t : hxsl.Type.TFloat, p : p},{ e : hxsl.TExprDef.TArray(_g.econsts,{ e : hxsl.TExprDef.TConst(hxsl.Const.CInt(index + 2)), t : hxsl.Type.TInt, p : p}), t : hxsl.Type.TFloat, p : p}]), t : hxsl.Type.TVec(3,hxsl.VecType.VFloat), p : p};
		case 4:
			return { e : hxsl.TExprDef.TCall({ e : hxsl.TExprDef.TGlobal(hxsl.TGlobal.Vec4), t : hxsl.Type.TVoid, p : p},[{ e : hxsl.TExprDef.TArray(_g.econsts,{ e : hxsl.TExprDef.TConst(hxsl.Const.CInt(index)), t : hxsl.Type.TInt, p : p}), t : hxsl.Type.TFloat, p : p},{ e : hxsl.TExprDef.TArray(_g.econsts,{ e : hxsl.TExprDef.TConst(hxsl.Const.CInt(index + 1)), t : hxsl.Type.TInt, p : p}), t : hxsl.Type.TFloat, p : p},{ e : hxsl.TExprDef.TArray(_g.econsts,{ e : hxsl.TExprDef.TConst(hxsl.Const.CInt(index + 3)), t : hxsl.Type.TInt, p : p}), t : hxsl.Type.TFloat, p : p},{ e : hxsl.TExprDef.TArray(_g.econsts,{ e : hxsl.TExprDef.TConst(hxsl.Const.CInt(index + 4)), t : hxsl.Type.TInt, p : p}), t : hxsl.Type.TFloat, p : p}]), t : hxsl.Type.TVec(4,hxsl.VecType.VFloat), p : p};
		default:
			throw "assert";
		}
	}
	,readIndex: function(a,index,pos) {
		return { e : hxsl.TExprDef.TArray({ e : hxsl.TExprDef.TVar(a.g), t : a.g.type, p : pos},{ e : hxsl.TExprDef.TConst(hxsl.Const.CInt((a.pos >> 2) + index)), t : hxsl.Type.TInt, p : pos}), t : hxsl.Type.TVec(4,a.t), p : pos};
	}
	,readOffset: function(a,stride,delta,index,pos) {
		var offset = { e : hxsl.TExprDef.TBinop(haxe.macro.Binop.OpAdd,delta,{ e : hxsl.TExprDef.TConst(hxsl.Const.CInt((a.pos >> 2) + index)), t : hxsl.Type.TInt, p : pos}), t : hxsl.Type.TInt, p : pos};
		return { e : hxsl.TExprDef.TArray({ e : hxsl.TExprDef.TVar(a.g), t : a.g.type, p : pos},offset), t : hxsl.Type.TVec(4,a.t), p : pos};
	}
	,access: function(a,t,pos,read) {
		switch(t[1]) {
		case 7:
			return { e : hxsl.TExprDef.TCall({ e : hxsl.TExprDef.TGlobal(hxsl.TGlobal.Mat4), t : hxsl.Type.TFun([]), p : pos},[read(0,pos),read(1,pos),read(2,pos),read(3,pos)]), t : hxsl.Type.TMat4, p : pos};
		case 8:
			return { e : hxsl.TExprDef.TCall({ e : hxsl.TExprDef.TGlobal(hxsl.TGlobal.Mat3x4), t : hxsl.Type.TFun([]), p : pos},[read(0,pos),read(1,pos),read(2,pos)]), t : hxsl.Type.TMat3x4, p : pos};
		case 14:
			switch(t[3][1]) {
			case 0:
				var t1 = t[2];
				var len = t[3][2];
				var stride = a.size / len | 0;
				var earr;
				var _g = [];
				var _g1 = 0;
				while(_g1 < len) {
					var i = _g1++;
					_g.push((function($this) {
						var $r;
						var a1 = new hxsl._Flatten.Alloc(a.g,a.t,a.pos + stride * i,stride);
						$r = $this.access(a1,t1,pos,(function(f,a2) {
							return function(a11,a21) {
								return f(a2,a11,a21);
							};
						})($bind($this,$this.readIndex),a1));
						return $r;
					}(this)));
				}
				earr = _g;
				return { e : hxsl.TExprDef.TArrayDecl(earr), t : t1, p : pos};
			default:
				var size = this.varSize(t,a.t);
				if(size <= 4) {
					var k = read(0,pos);
					if(size == 4) {
						if((a.pos & 3) != 0) throw "assert";
						return k;
					} else {
						var sw = [];
						var _g2 = 0;
						while(_g2 < size) {
							var i1 = _g2++;
							sw.push(hxsl.Tools.SWIZ[i1 + (a.pos & 3)]);
						}
						return { e : hxsl.TExprDef.TSwiz(k,sw), t : t, p : pos};
					}
				}
				return hxsl.Error.t("Access not supported for " + hxsl.Tools.toString(t),null);
			}
			break;
		case 10:case 11:
			return read(0,pos);
		default:
			var size = this.varSize(t,a.t);
			if(size <= 4) {
				var k = read(0,pos);
				if(size == 4) {
					if((a.pos & 3) != 0) throw "assert";
					return k;
				} else {
					var sw = [];
					var _g2 = 0;
					while(_g2 < size) {
						var i1 = _g2++;
						sw.push(hxsl.Tools.SWIZ[i1 + (a.pos & 3)]);
					}
					return { e : hxsl.TExprDef.TSwiz(k,sw), t : t, p : pos};
				}
			}
			return hxsl.Error.t("Access not supported for " + hxsl.Tools.toString(t),null);
		}
	}
	,optimize: function(e) {
		{
			var _g = e.e;
			switch(_g[1]) {
			case 8:
				switch(_g[2].e[1]) {
				case 2:
					switch(_g[2].e[2][1]) {
					case 49:
						switch(_g[3].length) {
						case 1:
							switch(_g[3][0].e[1]) {
							case 8:
								switch(_g[3][0].e[2].e[1]) {
								case 2:
									switch(_g[3][0].e[2].e[2][1]) {
									case 48:
										var args = _g[3][0].e[3];
										var rem = 0;
										var size = 0;
										while(size < 4) {
											var t = args[args.length - 1 - rem].t;
											size += this.varSize(t,hxsl.VecType.VFloat);
											rem++;
										}
										if(size == 4) {
											var _g1 = 0;
											while(_g1 < rem) {
												var i = _g1++;
												args.pop();
											}
											var emat;
											{
												var _g11 = e.e;
												switch(_g11[1]) {
												case 8:
													var e1 = _g11[2];
													emat = e1;
													break;
												default:
													throw "assert";
												}
											}
											return { e : hxsl.TExprDef.TCall(emat,args), t : e.t, p : e.p};
										}
										break;
									default:
									}
									break;
								default:
								}
								break;
							default:
							}
							break;
						default:
						}
						break;
					default:
					}
					break;
				default:
				}
				break;
			case 16:
				switch(_g[2].e[1]) {
				case 17:
					switch(_g[3].e[1]) {
					case 0:
						switch(_g[3].e[2][1]) {
						case 2:
							var el = _g[2].e[2];
							var i1 = _g[3].e[2][2];
							if(i1 >= 0 && i1 < el.length) return el[i1];
							hxsl.Error.t("Reading outside array bounds",e.p);
							break;
						default:
						}
						break;
					default:
					}
					break;
				default:
				}
				break;
			default:
			}
		}
		return e;
	}
	,packTextures: function(name,vars,t) {
		var alloc = new Array();
		var g = { id : hxsl.Tools.allocVarId(), name : name, type : t, kind : hxsl.VarKind.Param};
		var _g = 0;
		while(_g < vars.length) {
			var v = vars[_g];
			++_g;
			if(v.type != t) continue;
			var a = new hxsl._Flatten.Alloc(g,null,alloc.length << 2,1);
			a.v = v;
			this.varMap.set(v,a);
			alloc.push(a);
		}
		g.type = hxsl.Type.TArray(t,hxsl.SizeDecl.SConst(alloc.length));
		if(alloc.length > 0) {
			this.outVars.push(g);
			this.allocData.set(g,alloc);
		}
		return g;
	}
	,pack: function(name,kind,vars,t) {
		var alloc = new Array();
		var apos = 0;
		var g = { id : hxsl.Tools.allocVarId(), name : name, type : hxsl.Type.TVec(0,t), kind : kind};
		var _g = 0;
		while(_g < vars.length) {
			var v = vars[_g];
			++_g;
			var _g1 = v.type;
			switch(_g1[1]) {
			case 10:case 11:
				continue;
				break;
			default:
			}
			var size = this.varSize(v.type,t);
			var best = null;
			var _g11 = 0;
			while(_g11 < alloc.length) {
				var a = alloc[_g11];
				++_g11;
				if(a.v == null && a.size >= size && (best == null || best.size > a.size)) best = a;
			}
			if(best != null) {
				var free = best.size - size;
				if(free > 0) {
					var i = Lambda.indexOf(alloc,best);
					var a1 = new hxsl._Flatten.Alloc(g,t,best.pos + size,free);
					alloc.splice(i + 1,0,a1);
					best.size = size;
				}
				best.v = v;
				this.varMap.set(v,best);
			} else {
				var a2 = new hxsl._Flatten.Alloc(g,t,apos,size);
				apos += size;
				a2.v = v;
				this.varMap.set(v,a2);
				alloc.push(a2);
				var pad = (4 - size % 4) % 4;
				if(pad > 0) {
					var a3 = new hxsl._Flatten.Alloc(g,t,apos,pad);
					apos += pad;
					alloc.push(a3);
				}
			}
		}
		g.type = hxsl.Type.TArray(hxsl.Type.TVec(4,t),hxsl.SizeDecl.SConst(apos >> 2));
		if(apos > 0) {
			this.outVars.push(g);
			this.allocData.set(g,alloc);
		}
		return g;
	}
	,varSize: function(v,t) {
		switch(v[1]) {
		case 3:
			if(t == hxsl.VecType.VFloat) return 1; else throw hxsl.Tools.toString(v) + " size unknown for type " + Std.string(t);
			break;
		case 5:
			var t2 = v[3];
			var n = v[2];
			if(t == t2) return n; else throw hxsl.Tools.toString(v) + " size unknown for type " + Std.string(t);
			break;
		case 7:
			if(t == hxsl.VecType.VFloat) return 16; else throw hxsl.Tools.toString(v) + " size unknown for type " + Std.string(t);
			break;
		case 8:
			if(t == hxsl.VecType.VFloat) return 12; else throw hxsl.Tools.toString(v) + " size unknown for type " + Std.string(t);
			break;
		case 6:
			if(t == hxsl.VecType.VFloat) return 9; else throw hxsl.Tools.toString(v) + " size unknown for type " + Std.string(t);
			break;
		case 14:
			switch(v[3][1]) {
			case 0:
				var at = v[2];
				var n1 = v[3][2];
				return this.varSize(at,t) * n1;
			default:
				throw hxsl.Tools.toString(v) + " size unknown for type " + Std.string(t);
			}
			break;
		default:
			throw hxsl.Tools.toString(v) + " size unknown for type " + Std.string(t);
		}
	}
	,gatherVar: function(v) {
		{
			var _g = v.type;
			switch(_g[1]) {
			case 12:
				var vl = _g[2];
				var _g1 = 0;
				while(_g1 < vl.length) {
					var v1 = vl[_g1];
					++_g1;
					this.gatherVar(v1);
				}
				break;
			default:
				var _g11 = v.kind;
				switch(_g11[1]) {
				case 0:
					if(hxsl.Tools.hasQualifier(v,hxsl.VarQualifier.PerObject)) this.params.push(v); else this.globals.push(v);
					break;
				case 2:
					this.params.push(v);
					break;
				default:
					this.outVars.push(v);
				}
			}
		}
	}
	,__class__: hxsl.Flatten
};
hxsl.Globals = function() {
	this.map = new haxe.ds.IntMap();
};
$hxClasses["hxsl.Globals"] = hxsl.Globals;
hxsl.Globals.__name__ = true;
hxsl.Globals.allocID = function(path) {
	if(hxsl.Globals.MAP == null) {
		hxsl.Globals.MAP = new haxe.ds.StringMap();
		hxsl.Globals.ALL = [];
	}
	var id = hxsl.Globals.MAP.get(path);
	if(id == null) {
		id = hxsl.Globals.ALL.length;
		hxsl.Globals.ALL.push(path);
		hxsl.Globals.MAP.set(path,id);
	}
	return id;
};
hxsl.Globals.prototype = {
	fastSet: function(id,v) {
		var value = v;
		this.map.set(id,value);
	}
	,__class__: hxsl.Globals
};
var js = {};
js.Boot = function() { };
$hxClasses["js.Boot"] = js.Boot;
js.Boot.__name__ = true;
js.Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
};
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
};
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js.Boot.__interfLoop(js.Boot.getClass(o),cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
};
hxsl.GlslOut = function() {
	this.varNames = new haxe.ds.IntMap();
	this.allNames = new haxe.ds.StringMap();
};
$hxClasses["hxsl.GlslOut"] = hxsl.GlslOut;
hxsl.GlslOut.__name__ = true;
hxsl.GlslOut.prototype = {
	add: function(v) {
		this.buf.add(v);
	}
	,decl: function(s) {
		var _g = 0;
		var _g1 = this.decls;
		while(_g < _g1.length) {
			var d = _g1[_g];
			++_g;
			if(d == s) return;
		}
		this.decls.push(s);
	}
	,addType: function(t) {
		switch(t[1]) {
		case 0:
			this.buf.add("void");
			break;
		case 1:
			this.buf.add("int");
			break;
		case 9:
			var n = t[2];
			this.buf.add("vec");
			this.buf.add(n);
			break;
		case 2:
			this.buf.add("bool");
			break;
		case 3:
			this.buf.add("float");
			break;
		case 4:
			this.buf.add("string");
			break;
		case 5:
			var k = t[3];
			var size = t[2];
			switch(k[1]) {
			case 1:
				break;
			case 0:
				this.buf.add("i");
				break;
			case 2:
				this.buf.add("b");
				break;
			}
			this.buf.add("vec");
			this.buf.add(size);
			break;
		case 6:
			this.buf.add("mat3");
			break;
		case 7:
			this.buf.add("mat4");
			break;
		case 8:
			this.decl(hxsl.GlslOut.MAT34);
			this.buf.add("mat3x4");
			break;
		case 10:
			this.buf.add("sampler2D");
			break;
		case 11:
			this.buf.add("samplerCube");
			break;
		case 12:
			var vl = t[2];
			this.buf.add("struct { ");
			var _g = 0;
			while(_g < vl.length) {
				var v = vl[_g];
				++_g;
				this.addVar(v);
				this.buf.add(";");
			}
			this.buf.add(" }");
			break;
		case 13:
			this.buf.add("function");
			break;
		case 14:
			var size1 = t[3];
			var t1 = t[2];
			this.addType(t1);
			this.buf.add("[");
			switch(size1[1]) {
			case 1:
				var v1 = size1[2];
				this.add(this.varName(v1));
				break;
			case 0:
				var v2 = size1[2];
				this.buf.add(v2);
				break;
			}
			this.buf.add("]");
			break;
		}
	}
	,addVar: function(v) {
		{
			var _g = v.type;
			switch(_g[1]) {
			case 14:
				var size = _g[3];
				var t = _g[2];
				var old = v.type;
				v.type = t;
				this.addVar(v);
				v.type = old;
				this.buf.add("[");
				switch(size[1]) {
				case 1:
					var v1 = size[2];
					this.add(this.varName(v1));
					break;
				case 0:
					var n = size[2];
					this.buf.add(n);
					break;
				}
				this.buf.add("]");
				break;
			default:
				this.addType(v.type);
				this.buf.add(" ");
				this.add(this.varName(v));
			}
		}
	}
	,addValue: function(e,tabs) {
		{
			var _g = e.e;
			switch(_g[1]) {
			case 4:
				var el = _g[2];
				var name = "val" + this.exprValues.length;
				var tmp = this.buf;
				this.buf = new StringBuf();
				this.addType(e.t);
				this.buf.add(" ");
				this.buf.add(name);
				this.buf.add("(void)");
				var el2 = el.slice();
				var last = el2[el2.length - 1];
				el2[el2.length - 1] = { e : hxsl.TExprDef.TReturn(last), t : e.t, p : last.p};
				var e2 = { t : hxsl.Type.TVoid, e : hxsl.TExprDef.TBlock(el2), p : e.p};
				this.addExpr(e2,"");
				this.exprValues.push(this.buf.b);
				this.buf = tmp;
				this.buf.add(name);
				this.buf.add("()");
				break;
			default:
				this.addExpr(e,tabs);
			}
		}
	}
	,addExpr: function(e,tabs) {
		{
			var _g = e.e;
			switch(_g[1]) {
			case 0:
				var c = _g[2];
				switch(c[1]) {
				case 2:
					var v = c[2];
					this.buf.add(v);
					break;
				case 3:
					var f = c[2];
					var str = "" + f;
					this.buf.add(str);
					if(str.indexOf(".") == -1 && str.indexOf("e") == -1) this.buf.add(".");
					break;
				case 4:
					var v1 = c[2];
					this.buf.add("\"" + v1 + "\"");
					break;
				case 0:
					this.buf.add("null");
					break;
				case 1:
					var b = c[2];
					this.buf.add(b);
					break;
				}
				break;
			case 1:
				var v2 = _g[2];
				this.add(this.varName(v2));
				break;
			case 2:
				var g = _g[2];
				switch(g[1]) {
				case 49:
					this.decl(hxsl.GlslOut.MAT34);
					break;
				case 53:case 54:case 55:
					this.decl("#extension GL_OES_standard_derivatives:enable");
					break;
				case 51:
					this.decl("vec4 pack( float v ) { vec4 color = fract(v * vec4(1, 255, 255.*255., 255.*255.*255.)); return color - color.yzww * vec4(1. / 255., 1. / 255., 1. / 255., 0.); }");
					break;
				case 52:
					this.decl("float unpack( vec4 color ) { return dot(color,vec4(1., 1. / 255., 1. / (255. * 255.), 1. / (255. * 255. * 255.))); }");
					break;
				default:
				}
				this.add(hxsl.GlslOut.GLOBALS.get(g));
				break;
			case 3:
				var e1 = _g[2];
				this.buf.add("(");
				this.addValue(e1,tabs);
				this.buf.add(")");
				break;
			case 4:
				var el = _g[2];
				this.buf.add("{\n");
				var t2 = tabs + "\t";
				var _g1 = 0;
				while(_g1 < el.length) {
					var e2 = el[_g1];
					++_g1;
					this.buf.add(t2);
					this.addExpr(e2,t2);
					this.buf.add(";\n");
				}
				this.buf.add(tabs);
				this.buf.add("}");
				break;
			case 5:
				var e21 = _g[4];
				var e11 = _g[3];
				var op = _g[2];
				{
					var _g11 = e11.t;
					var _g2 = e21.t;
					switch(op[1]) {
					case 1:
						switch(_g11[1]) {
						case 5:
							switch(_g11[2]) {
							case 3:
								switch(_g11[3][1]) {
								case 1:
									switch(_g2[1]) {
									case 8:
										this.decl(hxsl.GlslOut.MAT34);
										this.decl("vec3 m3x4mult( vec3 v, mat3x4 m) { vec4 ve = vec4(v,1.0); return vec3(dot(m.a,ve),dot(m.b,ve),dot(m.c,ve)); }");
										this.buf.add("m3x4mult(");
										this.addValue(e11,tabs);
										this.buf.add(",");
										this.addValue(e21,tabs);
										this.buf.add(")");
										break;
									default:
										this.addValue(e11,tabs);
										this.buf.add(" ");
										this.add(hxsl.Printer.opStr(op));
										this.buf.add(" ");
										this.addValue(e21,tabs);
									}
									break;
								default:
									this.addValue(e11,tabs);
									this.buf.add(" ");
									this.add(hxsl.Printer.opStr(op));
									this.buf.add(" ");
									this.addValue(e21,tabs);
								}
								break;
							default:
								this.addValue(e11,tabs);
								this.buf.add(" ");
								this.add(hxsl.Printer.opStr(op));
								this.buf.add(" ");
								this.addValue(e21,tabs);
							}
							break;
						default:
							this.addValue(e11,tabs);
							this.buf.add(" ");
							this.add(hxsl.Printer.opStr(op));
							this.buf.add(" ");
							this.addValue(e21,tabs);
						}
						break;
					default:
						this.addValue(e11,tabs);
						this.buf.add(" ");
						this.add(hxsl.Printer.opStr(op));
						this.buf.add(" ");
						this.addValue(e21,tabs);
					}
				}
				break;
			case 6:
				var e12 = _g[3];
				var op1 = _g[2];
				this.buf.add((function($this) {
					var $r;
					switch(op1[1]) {
					case 2:
						$r = "!";
						break;
					case 3:
						$r = "-";
						break;
					case 0:
						$r = "++";
						break;
					case 1:
						$r = "--";
						break;
					case 4:
						$r = "~";
						break;
					}
					return $r;
				}(this)));
				this.addValue(e12,tabs);
				break;
			case 7:
				var init = _g[3];
				var v3 = _g[2];
				this.locals.push(v3);
				if(init != null) {
					this.add(this.varName(v3));
					this.buf.add(" = ");
					this.addValue(init,tabs);
				} else this.buf.add("/*var*/");
				break;
			case 8:
				var e3 = _g[2];
				switch(_g[2].e[1]) {
				case 2:
					switch(_g[2].e[2][1]) {
					case 50:
						var args = _g[3];
						switch(_g[3].length) {
						case 1:
							var e4 = _g[3][0];
							this.buf.add("clamp");
							this.buf.add("(");
							this.addValue(e4,tabs);
							this.buf.add(", 0., 1.)");
							break;
						default:
							this.addValue(e3,tabs);
							this.buf.add("(");
							var first = true;
							var _g12 = 0;
							while(_g12 < args.length) {
								var e5 = args[_g12];
								++_g12;
								if(first) first = false; else this.buf.add(", ");
								this.addValue(e5,tabs);
							}
							this.buf.add(")");
						}
						break;
					default:
						var args = _g[3];
						this.addValue(e3,tabs);
						this.buf.add("(");
						var first = true;
						var _g12 = 0;
						while(_g12 < args.length) {
							var e5 = args[_g12];
							++_g12;
							if(first) first = false; else this.buf.add(", ");
							this.addValue(e5,tabs);
						}
						this.buf.add(")");
					}
					break;
				default:
					var args = _g[3];
					this.addValue(e3,tabs);
					this.buf.add("(");
					var first = true;
					var _g12 = 0;
					while(_g12 < args.length) {
						var e5 = args[_g12];
						++_g12;
						if(first) first = false; else this.buf.add(", ");
						this.addValue(e5,tabs);
					}
					this.buf.add(")");
				}
				break;
			case 9:
				var regs = _g[3];
				var e6 = _g[2];
				var _g13 = e6.t;
				switch(_g13[1]) {
				case 3:
					var _g21 = 0;
					while(_g21 < regs.length) {
						var r = regs[_g21];
						++_g21;
						if(r != hxsl.Component.X) throw "assert";
					}
					var _g22 = regs.length;
					switch(_g22) {
					case 1:
						this.addValue(e6,tabs);
						break;
					case 2:
						this.decl("vec2 _vec2( float v ) { return vec2(v,v); }");
						this.buf.add("_vec2(");
						this.addValue(e6,tabs);
						this.buf.add(")");
						break;
					case 3:
						this.decl("vec3 _vec3( float v ) { return vec3(v,v,v); }");
						this.buf.add("_vec3(");
						this.addValue(e6,tabs);
						this.buf.add(")");
						break;
					case 4:
						this.decl("vec3 _vec4( float v ) { return vec4(v,v,v,v); }");
						this.buf.add("_vec4(");
						this.addValue(e6,tabs);
						this.buf.add(")");
						break;
					default:
						throw "assert";
					}
					break;
				default:
					this.addValue(e6,tabs);
					this.buf.add(".");
					var _g23 = 0;
					while(_g23 < regs.length) {
						var r1 = regs[_g23];
						++_g23;
						this.buf.add((function($this) {
							var $r;
							switch(r1[1]) {
							case 0:
								$r = "x";
								break;
							case 1:
								$r = "y";
								break;
							case 2:
								$r = "z";
								break;
							case 3:
								$r = "w";
								break;
							}
							return $r;
						}(this)));
					}
				}
				break;
			case 10:
				var eelse = _g[4];
				var eif = _g[3];
				var econd = _g[2];
				this.buf.add("if( ");
				this.addValue(econd,tabs);
				this.buf.add(") ");
				this.addExpr(eif,tabs);
				if(eelse != null) {
					this.buf.add(" else ");
					this.addExpr(eelse,tabs);
				}
				break;
			case 11:
				this.buf.add("discard");
				break;
			case 12:
				var e7 = _g[2];
				if(e7 == null) this.buf.add("return"); else {
					this.buf.add("return ");
					this.addValue(e7,tabs);
				}
				break;
			case 13:
				var loop = _g[4];
				var it = _g[3];
				var v4 = _g[2];
				this.buf.add("for(...)");
				break;
			case 14:
				this.buf.add("continue");
				break;
			case 15:
				this.buf.add("break");
				break;
			case 16:
				var index = _g[3];
				var e8 = _g[2];
				this.addValue(e8,tabs);
				this.buf.add("[");
				this.addValue(index,tabs);
				this.buf.add("]");
				break;
			case 17:
				var el1 = _g[2];
				this.buf.add("[");
				var first1 = true;
				var _g14 = 0;
				while(_g14 < el1.length) {
					var e9 = el1[_g14];
					++_g14;
					if(first1) first1 = false; else this.buf.add(", ");
					this.addValue(e9,tabs);
				}
				this.buf.add("]");
				break;
			}
		}
	}
	,varName: function(v) {
		if(v.kind == hxsl.VarKind.Output) if(this.isVertex) return "gl_Position"; else return "gl_FragColor";
		var n = this.varNames.get(v.id);
		if(n != null) return n;
		n = v.name;
		if(hxsl.GlslOut.KWDS.exists(n)) n = "_" + n;
		if(this.allNames.exists(n)) {
			var k = 2;
			n += "_";
			while(this.allNames.exists(n + k)) k++;
			n += k;
		}
		this.varNames.set(v.id,n);
		this.allNames.set(n,v.id);
		return n;
	}
	,run: function(s) {
		this.locals = [];
		this.decls = [];
		this.buf = new StringBuf();
		this.exprValues = [];
		this.decls.push("precision mediump float;");
		if(s.funs.length != 1) throw "assert";
		var f = s.funs[0];
		this.isVertex = f.kind == hxsl.FunctionKind.Vertex;
		var _g = 0;
		var _g1 = s.vars;
		while(_g < _g1.length) {
			var v = _g1[_g];
			++_g;
			var _g2 = v.kind;
			switch(_g2[1]) {
			case 2:case 0:
				this.buf.add("uniform ");
				break;
			case 1:
				this.buf.add("attribute ");
				break;
			case 3:
				this.buf.add("varying ");
				break;
			case 6:case 5:
				continue;
				break;
			case 4:
				break;
			}
			this.addVar(v);
			this.buf.add(";\n");
		}
		this.buf.add("\n");
		var tmp = this.buf;
		this.buf = new StringBuf();
		this.buf.add("void main(void) ");
		this.addExpr(f.expr,"");
		this.exprValues.push(this.buf.b);
		this.buf = tmp;
		var _g3 = 0;
		var _g11 = this.locals;
		while(_g3 < _g11.length) {
			var v1 = _g11[_g3];
			++_g3;
			this.addVar(v1);
			this.buf.add(";\n");
		}
		this.buf.add("\n");
		var _g4 = 0;
		var _g12 = this.exprValues;
		while(_g4 < _g12.length) {
			var e = _g12[_g4];
			++_g4;
			this.buf.add(e);
			this.buf.add("\n\n");
		}
		this.decls.push(this.buf.b);
		this.buf = null;
		return this.decls.join("\n");
	}
	,__class__: hxsl.GlslOut
};
hxsl._Linker = {};
hxsl._Linker.AllocatedVar = function() {
};
$hxClasses["hxsl._Linker.AllocatedVar"] = hxsl._Linker.AllocatedVar;
hxsl._Linker.AllocatedVar.__name__ = true;
hxsl._Linker.AllocatedVar.prototype = {
	__class__: hxsl._Linker.AllocatedVar
};
hxsl._Linker.ShaderInfos = function(n,v) {
	this.name = n;
	this.vertex = v;
	this.processed = new haxe.ds.IntMap();
	this.usedFunctions = [];
	this.read = new haxe.ds.IntMap();
	this.write = new haxe.ds.IntMap();
};
$hxClasses["hxsl._Linker.ShaderInfos"] = hxsl._Linker.ShaderInfos;
hxsl._Linker.ShaderInfos.__name__ = true;
hxsl._Linker.ShaderInfos.prototype = {
	__class__: hxsl._Linker.ShaderInfos
};
hxsl.Linker = function() {
};
$hxClasses["hxsl.Linker"] = hxsl.Linker;
hxsl.Linker.__name__ = true;
hxsl.Linker.prototype = {
	error: function(msg,p) {
		return hxsl.Error.t(msg,p);
	}
	,mergeVar: function(path,v,v2,p) {
		var _g = v.kind;
		switch(_g[1]) {
		case 0:case 1:case 3:case 4:case 5:
			break;
		case 2:case 6:
			throw "assert";
			break;
		}
		if(v.kind != v2.kind && v.kind != hxsl.VarKind.Local && v2.kind != hxsl.VarKind.Local) this.error("'" + path + "' kind does not match : " + Std.string(v.kind) + " should be " + Std.string(v2.kind),p);
		{
			var _g1 = v.type;
			var _g11 = v2.type;
			switch(_g1[1]) {
			case 12:
				switch(_g11[1]) {
				case 12:
					var fl1 = _g1[2];
					var fl2 = _g11[2];
					var _g2 = 0;
					while(_g2 < fl1.length) {
						var f1 = fl1[_g2];
						++_g2;
						var ft = null;
						var _g3 = 0;
						while(_g3 < fl2.length) {
							var f2 = fl2[_g3];
							++_g3;
							if(f1.name == f2.name) {
								ft = f2;
								break;
							}
						}
						if(ft == null) fl2.push(f1); else this.mergeVar(path + "." + ft.name,f1,ft,p);
					}
					break;
				default:
					if(!Type.enumEq(v.type,v2.type)) this.error("'" + path + "' type does not match : " + hxsl.Tools.toString(v.type) + " should be " + hxsl.Tools.toString(v2.type),p);
				}
				break;
			default:
				if(!Type.enumEq(v.type,v2.type)) this.error("'" + path + "' type does not match : " + hxsl.Tools.toString(v.type) + " should be " + hxsl.Tools.toString(v2.type),p);
			}
		}
	}
	,allocVar: function(v,p,path,parent) {
		if(v.parent != null && parent == null) {
			parent = this.allocVar(v.parent,p).v;
			var p1 = parent;
			path = p1.name;
			p1 = p1.parent;
			while(p1 != null) {
				path = p1.name + "." + path;
				p1 = p1.parent;
			}
		}
		var key;
		if(path == null) key = v.name; else key = path + "." + v.name;
		if(v.qualifiers != null) {
			var _g = 0;
			var _g1 = v.qualifiers;
			while(_g < _g1.length) {
				var q = _g1[_g];
				++_g;
				switch(q[1]) {
				case 4:
					var n = q[2];
					key = n;
					break;
				default:
				}
			}
		}
		var v2 = this.varMap.get(key);
		var vname = v.name;
		if(v2 != null) {
			var _g2 = 0;
			var _g11 = v2.merged;
			while(_g2 < _g11.length) {
				var vm = _g11[_g2];
				++_g2;
				if(vm == v) return v2;
			}
			if(v.kind == hxsl.VarKind.Param || v.kind == hxsl.VarKind.Function || v.kind == hxsl.VarKind.Var && hxsl.Tools.hasQualifier(v,hxsl.VarQualifier.Private)) {
				var k = 2;
				while(true) {
					var a = this.varMap.get(key + k);
					if(a == null) break;
					var _g3 = 0;
					var _g12 = a.merged;
					while(_g3 < _g12.length) {
						var vm1 = _g12[_g3];
						++_g3;
						if(vm1 == v) return a;
					}
					k++;
				}
				vname += k;
				key += k;
			} else {
				this.mergeVar(key,v,v2.v,p);
				v2.merged.push(v);
				this.varIdMap.set(v.id,v2.id);
				return v2;
			}
		}
		var vid = this.allVars.length + 1;
		var v21 = { id : vid, name : vname, type : v.type, kind : v.kind == hxsl.VarKind.Output?hxsl.VarKind.Local:v.kind, qualifiers : v.qualifiers, parent : parent};
		var a1 = new hxsl._Linker.AllocatedVar();
		a1.v = v21;
		a1.merged = [v];
		a1.path = key;
		a1.id = vid;
		if(parent == null) a1.parent = null; else a1.parent = this.allocVar(parent,p);
		a1.instanceIndex = this.curInstance;
		this.allVars.push(a1);
		this.varMap.set(key,a1);
		{
			var _g4 = v21.type;
			switch(_g4[1]) {
			case 12:
				var vl = _g4[2];
				v21.type = hxsl.Type.TStruct((function($this) {
					var $r;
					var _g13 = [];
					{
						var _g21 = 0;
						while(_g21 < vl.length) {
							var v1 = vl[_g21];
							++_g21;
							_g13.push($this.allocVar(v1,p,key,v21).v);
						}
					}
					$r = _g13;
					return $r;
				}(this)));
				break;
			default:
			}
		}
		return a1;
	}
	,mapExprVar: function(e) {
		{
			var _g = e.e;
			switch(_g[1]) {
			case 1:
				var v = _g[2];
				if(!this.locals.exists(v.id)) {
					var v1 = this.allocVar(v,e.p);
					if(this.curShader != null) {
						this.curShader.read.set(v1.id,v1);
						if(v1.v.kind == hxsl.VarKind.Var) this.curShader.vertex = false;
					}
					return { e : hxsl.TExprDef.TVar(v1.v), t : v1.v.type, p : e.p};
				} else {
				}
				break;
			case 5:
				var e2 = _g[4];
				var e1 = _g[3];
				var op = _g[2];
				{
					var _g1 = e1.e;
					switch(op[1]) {
					case 4:
						switch(_g1[1]) {
						case 1:
							var v2 = _g1[2];
							if(!this.locals.exists(v2.id)) {
								var v3 = this.allocVar(v2,e1.p);
								if(this.curShader != null) this.curShader.write.set(v3.id,v3);
								if(op == haxe.macro.Binop.OpAssign && (function($this) {
									var $r;
									var _g2 = e1.e;
									$r = (function($this) {
										var $r;
										switch(_g2[1]) {
										case 1:
											$r = true;
											break;
										default:
											$r = false;
										}
										return $r;
									}($this));
									return $r;
								}(this))) {
									var eout = { e : hxsl.TExprDef.TVar(v3.v), t : e1.t, p : e1.p};
									return { e : hxsl.TExprDef.TBinop(haxe.macro.Binop.OpAssign,eout,this.mapExprVar(e2)), t : e.t, p : e.p};
								}
							} else {
							}
							break;
						case 9:
							switch(_g1[2].e[1]) {
							case 1:
								var v2 = _g1[2].e[2];
								if(!this.locals.exists(v2.id)) {
									var v3 = this.allocVar(v2,e1.p);
									if(this.curShader != null) this.curShader.write.set(v3.id,v3);
									if(op == haxe.macro.Binop.OpAssign && (function($this) {
										var $r;
										var _g2 = e1.e;
										$r = (function($this) {
											var $r;
											switch(_g2[1]) {
											case 1:
												$r = true;
												break;
											default:
												$r = false;
											}
											return $r;
										}($this));
										return $r;
									}(this))) {
										var eout = { e : hxsl.TExprDef.TVar(v3.v), t : e1.t, p : e1.p};
										return { e : hxsl.TExprDef.TBinop(haxe.macro.Binop.OpAssign,eout,this.mapExprVar(e2)), t : e.t, p : e.p};
									}
								} else {
								}
								break;
							default:
							}
							break;
						default:
						}
						break;
					case 20:
						switch(_g1[1]) {
						case 1:
							var v2 = _g1[2];
							if(!this.locals.exists(v2.id)) {
								var v3 = this.allocVar(v2,e1.p);
								if(this.curShader != null) this.curShader.write.set(v3.id,v3);
								if(op == haxe.macro.Binop.OpAssign && (function($this) {
									var $r;
									var _g2 = e1.e;
									$r = (function($this) {
										var $r;
										switch(_g2[1]) {
										case 1:
											$r = true;
											break;
										default:
											$r = false;
										}
										return $r;
									}($this));
									return $r;
								}(this))) {
									var eout = { e : hxsl.TExprDef.TVar(v3.v), t : e1.t, p : e1.p};
									return { e : hxsl.TExprDef.TBinop(haxe.macro.Binop.OpAssign,eout,this.mapExprVar(e2)), t : e.t, p : e.p};
								}
							} else {
							}
							break;
						case 9:
							switch(_g1[2].e[1]) {
							case 1:
								var v2 = _g1[2].e[2];
								if(!this.locals.exists(v2.id)) {
									var v3 = this.allocVar(v2,e1.p);
									if(this.curShader != null) this.curShader.write.set(v3.id,v3);
									if(op == haxe.macro.Binop.OpAssign && (function($this) {
										var $r;
										var _g2 = e1.e;
										$r = (function($this) {
											var $r;
											switch(_g2[1]) {
											case 1:
												$r = true;
												break;
											default:
												$r = false;
											}
											return $r;
										}($this));
										return $r;
									}(this))) {
										var eout = { e : hxsl.TExprDef.TVar(v3.v), t : e1.t, p : e1.p};
										return { e : hxsl.TExprDef.TBinop(haxe.macro.Binop.OpAssign,eout,this.mapExprVar(e2)), t : e.t, p : e.p};
									}
								} else {
								}
								break;
							default:
							}
							break;
						default:
						}
						break;
					default:
					}
				}
				break;
			case 11:
				if(this.curShader != null) {
					this.curShader.vertex = false;
					this.curShader.hasDiscard = true;
				}
				break;
			case 7:
				var v4 = _g[2];
				this.locals.set(v4.id,true);
				break;
			default:
			}
		}
		return hxsl.Tools.map(e,$bind(this,this.mapExprVar));
	}
	,addShader: function(name,vertex,e,p) {
		var s = new hxsl._Linker.ShaderInfos(name,vertex);
		this.curShader = s;
		s.priority = p;
		s.body = this.mapExprVar(e);
		this.shaders.push(s);
		this.curShader = null;
		return s;
	}
	,sortByPriorityDesc: function(s1,s2) {
		return s2.priority - s1.priority;
	}
	,buildDependency: function(parent,v,isWritten) {
		var found = !isWritten;
		var _g = 0;
		var _g1 = this.shaders;
		while(_g < _g1.length) {
			var s = _g1[_g];
			++_g;
			if(parent == s) {
				found = true;
				continue;
			} else if(!found) continue;
			if(!s.write.exists(v.id)) continue;
			parent.deps.set(s,true);
			this.initDependencies(s);
			if(!s.read.exists(v.id)) return;
		}
		if(v.v.kind == hxsl.VarKind.Var) this.error("Variable " + v.path + " required by " + parent.name + " is missing initializer",null);
	}
	,initDependencies: function(s) {
		if(s.deps != null) return;
		s.deps = new haxe.ds.ObjectMap();
		var $it0 = s.read.iterator();
		while( $it0.hasNext() ) {
			var r = $it0.next();
			this.buildDependency(s,r,s.write.exists(r.id));
		}
		if(s.vertex == null) {
			var $it1 = s.deps.keys();
			while( $it1.hasNext() ) {
				var d = $it1.next();
				if(d.vertex == false) {
					s.vertex = false;
					break;
				}
			}
		}
	}
	,collect: function(cur,out,vertex) {
		if(cur.onStack) this.error("Loop in shader dependencies (" + cur.name + ")",null);
		if(cur.marked == vertex) return;
		cur.marked = vertex;
		cur.onStack = true;
		var $it0 = cur.deps.keys();
		while( $it0.hasNext() ) {
			var d = $it0.next();
			this.collect(d,out,vertex);
		}
		if(cur.vertex == null) cur.vertex = vertex;
		if(cur.vertex == vertex) out.push(cur);
		cur.onStack = false;
	}
	,uniqueLocals: function(expr,locals) {
		{
			var _g = expr.e;
			switch(_g[1]) {
			case 7:
				var v = _g[2];
				if(locals.exists(v.name)) {
					var k = 2;
					while(locals.exists(v.name + k)) k++;
					v.name += k;
				}
				locals.set(v.name,true);
				break;
			case 4:
				var el = _g[2];
				var locals1;
				var _g1 = new haxe.ds.StringMap();
				var $it0 = locals.keys();
				while( $it0.hasNext() ) {
					var k1 = $it0.next();
					_g1.set(k1,true);
				}
				locals1 = _g1;
				var _g2 = 0;
				while(_g2 < el.length) {
					var e = el[_g2];
					++_g2;
					this.uniqueLocals(e,locals1);
				}
				break;
			default:
				hxsl.Tools.iter(expr,(function(f,a2) {
					return function(a1) {
						return f(a1,a2);
					};
				})($bind(this,this.uniqueLocals),locals));
			}
		}
	}
	,link: function(shadersData,outVars) {
		var _g1 = this;
		this.varMap = new haxe.ds.StringMap();
		this.varIdMap = new haxe.ds.IntMap();
		this.allVars = new Array();
		this.shaders = [];
		this.locals = new haxe.ds.IntMap();
		var dupShaders = new haxe.ds.ObjectMap();
		var _g = [];
		var _g11 = 0;
		while(_g11 < shadersData.length) {
			var s = shadersData[_g11];
			++_g11;
			_g.push((function($this) {
				var $r;
				var s1 = s;
				var sreal = s1;
				if(dupShaders.h.__keys__[s1.__id__] != null) s1 = hxsl.Clone.shaderData(s1);
				dupShaders.set(s1,sreal);
				$r = s1;
				return $r;
			}(this)));
		}
		shadersData = _g;
		this.curInstance = 0;
		var _g12 = 0;
		while(_g12 < shadersData.length) {
			var s2 = shadersData[_g12];
			++_g12;
			var _g2 = 0;
			var _g3 = s2.vars;
			while(_g2 < _g3.length) {
				var v = _g3[_g2];
				++_g2;
				this.allocVar(v,null);
			}
			var _g21 = 0;
			var _g31 = s2.funs;
			while(_g21 < _g31.length) {
				var f = _g31[_g21];
				++_g21;
				var v1 = this.allocVar(f.ref,f.expr.p);
				v1.kind = f.kind;
			}
			this.curInstance++;
		}
		var priority = 0;
		var _g13 = 0;
		while(_g13 < shadersData.length) {
			var s3 = shadersData[_g13];
			++_g13;
			var _g22 = 0;
			var _g32 = s3.funs;
			while(_g22 < _g32.length) {
				var f1 = _g32[_g22];
				++_g22;
				var v2 = this.allocVar(f1.ref,f1.expr.p);
				if(v2.kind == null) throw "assert";
				var _g4 = v2.kind;
				switch(_g4[1]) {
				case 0:case 1:
					this.addShader(s3.name + "." + (v2.kind == hxsl.FunctionKind.Vertex?"vertex":"fragment"),v2.kind == hxsl.FunctionKind.Vertex,f1.expr,priority);
					break;
				case 2:
					{
						var _g5 = f1.expr.e;
						switch(_g5[1]) {
						case 4:
							var el = _g5[2];
							var index = 0;
							var priority1 = -el.length;
							var _g6 = 0;
							while(_g6 < el.length) {
								var e = el[_g6];
								++_g6;
								this.addShader(s3.name + ".__init__" + index++,null,e,priority1++);
							}
							break;
						default:
							this.addShader(s3.name + ".__init__",null,f1.expr,-1);
						}
					}
					break;
				case 3:
					throw "Unexpected helper function in linker " + v2.v.name;
					break;
				}
			}
			priority++;
		}
		this.shaders.sort($bind(this,this.sortByPriorityDesc));
		var entry = new hxsl._Linker.ShaderInfos("<entry>",false);
		entry.deps = new haxe.ds.ObjectMap();
		var _g14 = 0;
		while(_g14 < outVars.length) {
			var outVar = outVars[_g14];
			++_g14;
			var v3 = this.varMap.get(outVar);
			if(v3 == null) throw "Variable not found " + outVar;
			v3.v.kind = hxsl.VarKind.Output;
			this.buildDependency(entry,v3,false);
		}
		var _g15 = 0;
		var _g23 = this.shaders;
		while(_g15 < _g23.length) {
			var s4 = _g23[_g15];
			++_g15;
			if(s4.hasDiscard) {
				this.initDependencies(s4);
				entry.deps.set(s4,true);
			}
		}
		var v4 = [];
		var f2 = [];
		this.collect(entry,v4,true);
		this.collect(entry,f2,false);
		if(f2.pop() != entry) throw "assert";
		var _g16 = 0;
		var _g24 = this.shaders;
		while(_g16 < _g24.length) {
			var s5 = _g24[_g16];
			++_g16;
			s5.marked = null;
		}
		var _g17 = 0;
		var _g25 = v4.concat(f2);
		while(_g17 < _g25.length) {
			var s6 = _g25[_g17];
			++_g17;
			var $it0 = s6.deps.keys();
			while( $it0.hasNext() ) {
				var d = $it0.next();
				if(d.marked == null) this.error(d.name + " needed by " + s6.name + " is unreachable",null);
			}
			s6.marked = true;
		}
		var outVars1 = [];
		var varMap = new haxe.ds.IntMap();
		var addVar;
		var addVar1 = null;
		addVar1 = function(v5) {
			if(varMap.exists(v5.id)) return;
			varMap.set(v5.id,true);
			if(v5.v.parent != null) addVar1(v5.parent); else outVars1.push(v5.v);
		};
		addVar = addVar1;
		var _g18 = 0;
		var _g26 = v4.concat(f2);
		while(_g18 < _g26.length) {
			var s7 = _g26[_g18];
			++_g18;
			var $it1 = s7.read.iterator();
			while( $it1.hasNext() ) {
				var v6 = $it1.next();
				addVar(v6);
			}
			var $it2 = s7.write.iterator();
			while( $it2.hasNext() ) {
				var v7 = $it2.next();
				addVar(v7);
			}
		}
		var cleanVar;
		var cleanVar1 = null;
		cleanVar1 = function(v8) {
			{
				var _g19 = v8.type;
				switch(_g19[1]) {
				case 12:
					var vl = _g19[2];
					if(v8.kind != hxsl.VarKind.Input) {
						var vout = [];
						var _g27 = 0;
						while(_g27 < vl.length) {
							var v9 = vl[_g27];
							++_g27;
							if(varMap.exists(v9.id)) {
								cleanVar1(v9);
								vout.push(v9);
							}
						}
						v8.type = hxsl.Type.TStruct(vout);
					} else {
					}
					break;
				default:
				}
			}
		};
		cleanVar = cleanVar1;
		var _g110 = 0;
		while(_g110 < outVars1.length) {
			var v10 = outVars1[_g110];
			++_g110;
			cleanVar(v10);
		}
		var build = function(kind,name,a) {
			var v11 = { id : hxsl.Tools.allocVarId(), name : name, type : hxsl.Type.TFun([{ ret : hxsl.Type.TVoid, args : []}]), kind : hxsl.VarKind.Function};
			outVars1.push(v11);
			var exprs = [];
			var _g111 = 0;
			while(_g111 < a.length) {
				var s8 = a[_g111];
				++_g111;
				{
					var _g28 = s8.body.e;
					switch(_g28[1]) {
					case 4:
						var el1 = _g28[2];
						var _g33 = 0;
						while(_g33 < el1.length) {
							var e1 = el1[_g33];
							++_g33;
							exprs.push(e1);
						}
						break;
					default:
						exprs.push(s8.body);
					}
				}
			}
			var expr = { e : hxsl.TExprDef.TBlock(exprs), t : hxsl.Type.TVoid, p : exprs.length == 0?null:exprs[0].p};
			_g1.uniqueLocals(expr,new haxe.ds.StringMap());
			return { kind : kind, ref : v11, ret : hxsl.Type.TVoid, args : [], expr : expr};
		};
		var funs = [build(hxsl.FunctionKind.Vertex,"vertex",v4),build(hxsl.FunctionKind.Fragment,"fragment",f2)];
		var $it3 = dupShaders.keys();
		while( $it3.hasNext() ) {
			var s9 = $it3.next();
			var sreal1 = dupShaders.h[s9.__id__];
			if(s9 == sreal1) continue;
			var _g29 = 0;
			var _g112 = s9.vars.length;
			while(_g29 < _g112) {
				var i = _g29++;
				this.allocVar(s9.vars[i],null).merged.unshift(sreal1.vars[i]);
			}
		}
		return { name : "out", vars : outVars1, funs : funs};
	}
	,__class__: hxsl.Linker
};
hxsl.Printer = function(varId) {
	if(varId == null) varId = false;
	this.varId = varId;
};
$hxClasses["hxsl.Printer"] = hxsl.Printer;
hxsl.Printer.__name__ = true;
hxsl.Printer.opStr = function(op) {
	switch(op[1]) {
	case 0:
		return "+";
	case 3:
		return "-";
	case 1:
		return "*";
	case 2:
		return "/";
	case 19:
		return "%";
	case 5:
		return "==";
	case 6:
		return "!=";
	case 7:
		return ">";
	case 9:
		return "<";
	case 8:
		return ">=";
	case 10:
		return "<=";
	case 13:
		return "^";
	case 12:
		return "|";
	case 11:
		return "&";
	case 16:
		return "<<";
	case 17:
		return ">>";
	case 18:
		return ">>>";
	case 14:
		return "&&";
	case 15:
		return "||";
	case 4:
		return "=";
	case 20:
		var op1 = op[2];
		return hxsl.Printer.opStr(op1) + "=";
	case 22:
		return "=>";
	case 21:
		return "...";
	}
};
hxsl.Printer.prototype = {
	add: function(v) {
		this.buffer.add(v);
	}
	,exprString: function(e) {
		this.buffer = new StringBuf();
		this.addExpr(e,"");
		return this.buffer.b;
	}
	,addVar: function(v,defKind,tabs,parent) {
		if(tabs == null) tabs = "";
		if(v.qualifiers != null) {
			var _g = 0;
			var _g1 = v.qualifiers;
			while(_g < _g1.length) {
				var q = _g1[_g];
				++_g;
				this.buffer.add("@" + (function($this) {
					var $r;
					switch(q[1]) {
					case 0:
						$r = (function($this) {
							var $r;
							var max = q[2];
							$r = "const" + (max == null?"":"(" + max + ")");
							return $r;
						}($this));
						break;
					case 1:
						$r = "private";
						break;
					case 2:
						$r = "nullable";
						break;
					case 3:
						$r = "perObject";
						break;
					case 4:
						$r = (function($this) {
							var $r;
							var n = q[2];
							$r = "name('" + n + "')";
							return $r;
						}($this));
						break;
					}
					return $r;
				}(this)) + " ");
			}
		}
		if(v.kind != defKind) {
			var _g2 = v.kind;
			switch(_g2[1]) {
			case 4:
				this.buffer.add("@local ");
				break;
			case 0:
				this.buffer.add("@global ");
				break;
			case 3:
				this.buffer.add("@var ");
				break;
			case 2:
				this.buffer.add("@param ");
				break;
			case 1:
				this.buffer.add("@input ");
				break;
			case 6:
				this.buffer.add("@function ");
				break;
			case 5:
				this.buffer.add("@output ");
				break;
			}
		}
		this.buffer.add("var ");
		if(v.parent == parent) this.buffer.add(v.name + (this.varId?"@" + v.id:"")); else this.addVarName(v);
		this.buffer.add(" : ");
		{
			var _g3 = v.type;
			switch(_g3[1]) {
			case 12:
				var vl = _g3[2];
				this.buffer.add("{");
				var first = true;
				var _g11 = 0;
				while(_g11 < vl.length) {
					var v1 = vl[_g11];
					++_g11;
					if(first) first = false; else this.buffer.add(", ");
					this.addVar(v1,v1.kind,tabs,v1);
				}
				this.buffer.add("}");
				break;
			default:
				this.add(hxsl.Tools.toString(v.type));
			}
		}
	}
	,addVarName: function(v) {
		if(v.parent != null) {
			this.addVarName(v.parent);
			this.buffer.add(".");
		}
		this.buffer.add(v.name);
		if(this.varId) this.buffer.add("@" + v.id);
	}
	,addExpr: function(e,tabs) {
		{
			var _g = e.e;
			switch(_g[1]) {
			case 1:
				var v = _g[2];
				this.addVarName(v);
				break;
			case 7:
				var init = _g[3];
				var v1 = _g[2];
				this.addVar(v1,hxsl.VarKind.Local,tabs);
				if(init != null) {
					this.buffer.add(" = ");
					this.addExpr(init,tabs);
				}
				break;
			case 9:
				var regs = _g[3];
				var e1 = _g[2];
				this.addExpr(e1,tabs);
				this.buffer.add(".");
				var _g1 = 0;
				while(_g1 < regs.length) {
					var r = regs[_g1];
					++_g1;
					this.add(Std.string(r).toLowerCase());
				}
				break;
			case 12:
				var e2 = _g[2];
				this.buffer.add("return");
				if(e2 != null) {
					this.buffer.add(" ");
					this.addExpr(e2,tabs);
				}
				break;
			case 10:
				var eelse = _g[4];
				var eif = _g[3];
				var cond = _g[2];
				this.buffer.add("if( ");
				this.addExpr(cond,tabs);
				this.buffer.add(" ) ");
				this.addExpr(eif,tabs);
				if(eelse != null) {
					this.buffer.add(" else ");
					this.addExpr(eelse,tabs);
				}
				break;
			case 2:
				var g = _g[2];
				this.add(hxsl.Tools2.toString(g));
				break;
			case 8:
				var el = _g[3];
				var e3 = _g[2];
				this.addExpr(e3,tabs);
				this.buffer.add("(");
				var first = true;
				var _g11 = 0;
				while(_g11 < el.length) {
					var e4 = el[_g11];
					++_g11;
					if(first) first = false; else this.buffer.add(", ");
					this.addExpr(e4,tabs);
				}
				this.buffer.add(")");
				break;
			case 13:
				var loop = _g[4];
				var it = _g[3];
				var v2 = _g[2];
				this.buffer.add("for( " + v2.name + " in ");
				this.addExpr(it,tabs);
				this.buffer.add(") ");
				this.addExpr(loop,tabs);
				break;
			case 14:
				this.buffer.add("continue");
				break;
			case 15:
				this.buffer.add("break");
				break;
			case 11:
				this.buffer.add("discard");
				break;
			case 4:
				var el1 = _g[2];
				this.buffer.add("{");
				tabs += "\t";
				var _g12 = 0;
				while(_g12 < el1.length) {
					var e5 = el1[_g12];
					++_g12;
					this.buffer.add("\n" + tabs);
					this.addExpr(e5,tabs);
					this.buffer.add(";");
				}
				tabs = HxOverrides.substr(tabs,1,null);
				if(el1.length > 0) this.buffer.add("\n" + tabs);
				this.buffer.add("}");
				break;
			case 6:
				var e6 = _g[3];
				var op = _g[2];
				this.buffer.add((function($this) {
					var $r;
					switch(op[1]) {
					case 2:
						$r = "!";
						break;
					case 3:
						$r = "-";
						break;
					case 4:
						$r = "~";
						break;
					case 0:
						$r = "++";
						break;
					case 1:
						$r = "--";
						break;
					}
					return $r;
				}(this)));
				this.addExpr(e6,tabs);
				break;
			case 5:
				var e21 = _g[4];
				var e11 = _g[3];
				var op1 = _g[2];
				this.addExpr(e11,tabs);
				this.add(" " + hxsl.Printer.opStr(op1) + " ");
				this.addExpr(e21,tabs);
				break;
			case 16:
				var e22 = _g[3];
				var e12 = _g[2];
				this.addExpr(e12,tabs);
				this.buffer.add("[");
				this.addExpr(e22,tabs);
				this.buffer.add("]");
				break;
			case 3:
				var e7 = _g[2];
				this.buffer.add("(");
				this.addExpr(e7,tabs);
				this.buffer.add(")");
				break;
			case 0:
				var c = _g[2];
				this.buffer.add((function($this) {
					var $r;
					switch(c[1]) {
					case 0:
						$r = "null";
						break;
					case 1:
						$r = (function($this) {
							var $r;
							var b = c[2];
							$r = b;
							return $r;
						}($this));
						break;
					case 2:
						$r = (function($this) {
							var $r;
							var i = c[2];
							$r = i;
							return $r;
						}($this));
						break;
					case 3:
						$r = (function($this) {
							var $r;
							var f = c[2];
							$r = f;
							return $r;
						}($this));
						break;
					case 4:
						$r = (function($this) {
							var $r;
							var s = c[2];
							$r = "\"" + s + "\"";
							return $r;
						}($this));
						break;
					}
					return $r;
				}(this)));
				break;
			case 17:
				var el2 = _g[2];
				this.buffer.add("[");
				var first1 = true;
				var _g13 = 0;
				while(_g13 < el2.length) {
					var e8 = el2[_g13];
					++_g13;
					if(first1) first1 = false; else this.buffer.add(", ");
					this.addExpr(e8,tabs);
				}
				this.buffer.add("]");
				break;
			}
		}
	}
	,__class__: hxsl.Printer
};
hxsl.AllocParam = function(name,pos,instance,index,type) {
	this.name = name;
	this.pos = pos;
	this.instance = instance;
	this.index = index;
	this.type = type;
};
$hxClasses["hxsl.AllocParam"] = hxsl.AllocParam;
hxsl.AllocParam.__name__ = true;
hxsl.AllocParam.prototype = {
	__class__: hxsl.AllocParam
};
hxsl.AllocGlobal = function(pos,path,type) {
	this.pos = pos;
	this.path = path;
	this.gid = hxsl.Globals.allocID(path);
	this.type = type;
};
$hxClasses["hxsl.AllocGlobal"] = hxsl.AllocGlobal;
hxsl.AllocGlobal.__name__ = true;
hxsl.AllocGlobal.prototype = {
	__class__: hxsl.AllocGlobal
};
hxsl.RuntimeShaderData = function() {
};
$hxClasses["hxsl.RuntimeShaderData"] = hxsl.RuntimeShaderData;
hxsl.RuntimeShaderData.__name__ = true;
hxsl.RuntimeShaderData.prototype = {
	__class__: hxsl.RuntimeShaderData
};
hxsl.RuntimeShader = function() {
	this.id = hxsl.RuntimeShader.UID++;
};
$hxClasses["hxsl.RuntimeShader"] = hxsl.RuntimeShader;
hxsl.RuntimeShader.__name__ = true;
hxsl.RuntimeShader.prototype = {
	__class__: hxsl.RuntimeShader
};
hxsl.ShaderList = function(s,n) {
	this.s = s;
	this.next = n;
};
$hxClasses["hxsl.ShaderList"] = hxsl.ShaderList;
hxsl.ShaderList.__name__ = true;
hxsl.ShaderList.prototype = {
	__class__: hxsl.ShaderList
};
hxsl._ShaderList = {};
hxsl._ShaderList.ShaderIterator = function(l) {
	this.l = l;
};
$hxClasses["hxsl._ShaderList.ShaderIterator"] = hxsl._ShaderList.ShaderIterator;
hxsl._ShaderList.ShaderIterator.__name__ = true;
hxsl._ShaderList.ShaderIterator.prototype = {
	hasNext: function() {
		return this.l != null;
	}
	,next: function() {
		var s = this.l.s;
		this.l = this.l.next;
		return s;
	}
	,__class__: hxsl._ShaderList.ShaderIterator
};
hxsl.ShaderGlobal = function(v,gid) {
	this.v = v;
	this.globalId = gid;
};
$hxClasses["hxsl.ShaderGlobal"] = hxsl.ShaderGlobal;
hxsl.ShaderGlobal.__name__ = true;
hxsl.ShaderGlobal.prototype = {
	__class__: hxsl.ShaderGlobal
};
hxsl.ShaderConst = function(v,pos,bits) {
	this.v = v;
	this.pos = pos;
	this.bits = bits;
};
$hxClasses["hxsl.ShaderConst"] = hxsl.ShaderConst;
hxsl.ShaderConst.__name__ = true;
hxsl.ShaderConst.prototype = {
	__class__: hxsl.ShaderConst
};
hxsl._Splitter = {};
hxsl._Splitter.VarProps = function(v) {
	this.v = v;
	this.read = 0;
	this.write = 0;
};
$hxClasses["hxsl._Splitter.VarProps"] = hxsl._Splitter.VarProps;
hxsl._Splitter.VarProps.__name__ = true;
hxsl._Splitter.VarProps.prototype = {
	__class__: hxsl._Splitter.VarProps
};
hxsl.Splitter = function() {
};
$hxClasses["hxsl.Splitter"] = hxsl.Splitter;
hxsl.Splitter.__name__ = true;
hxsl.Splitter.prototype = {
	split: function(s) {
		var vfun = null;
		var vvars = new haxe.ds.IntMap();
		var ffun = null;
		var fvars = new haxe.ds.IntMap();
		this.varNames = new haxe.ds.StringMap();
		var _g = 0;
		var _g1 = s.funs;
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			var _g2 = f.kind;
			switch(_g2[1]) {
			case 0:
				this.vars = vvars;
				vfun = f;
				this.checkExpr(f.expr);
				break;
			case 1:
				this.vars = fvars;
				ffun = f;
				this.checkExpr(f.expr);
				break;
			default:
				throw "assert";
			}
		}
		this.varMap = new haxe.ds.ObjectMap();
		var $it0 = vvars.iterator();
		while( $it0.hasNext() ) {
			var inf = $it0.next();
			var v = inf.v;
			var _g3 = v.kind;
			switch(_g3[1]) {
			case 3:case 4:
				if(fvars.exists(v.id)) v.kind = hxsl.VarKind.Var; else v.kind = hxsl.VarKind.Local;
				break;
			default:
			}
			var _g4 = v.kind;
			switch(_g4[1]) {
			case 3:case 5:
				if(inf.read > 0 || inf.write > 1) {
					var nv = { id : hxsl.Tools.allocVarId(), name : v.name, kind : v.kind, type : v.type};
					this.vars = vvars;
					var ninf = this.get(nv);
					v.kind = hxsl.VarKind.Local;
					var p = vfun.expr.p;
					var e = { e : hxsl.TExprDef.TBinop(haxe.macro.Binop.OpAssign,{ e : hxsl.TExprDef.TVar(nv), t : nv.type, p : p},{ e : hxsl.TExprDef.TVar(v), t : v.type, p : p}), t : nv.type, p : p};
					this.addExpr(vfun,e);
					this.checkExpr(e);
					if(nv.kind == hxsl.VarKind.Var) {
						var old = fvars.get(v.id);
						this.varMap.set(v,nv);
						fvars.remove(v.id);
						var np = new hxsl._Splitter.VarProps(nv);
						np.read = old.read;
						np.write = old.write;
						fvars.set(nv.id,np);
					}
				}
				break;
			default:
			}
		}
		var finits = [];
		var $it1 = fvars.iterator();
		while( $it1.hasNext() ) {
			var inf1 = $it1.next();
			var v1 = inf1.v;
			var _g5 = v1.kind;
			switch(_g5[1]) {
			case 1:
				var nv1 = { id : hxsl.Tools.allocVarId(), name : v1.name, kind : hxsl.VarKind.Var, type : v1.type};
				this.uniqueName(nv1);
				var i = vvars.get(v1.id);
				if(i == null) {
					i = new hxsl._Splitter.VarProps(v1);
					vvars.set(v1.id,i);
				}
				i.read++;
				var vp = new hxsl._Splitter.VarProps(nv1);
				vp.write = 1;
				vvars.set(nv1.id,vp);
				var fp = new hxsl._Splitter.VarProps(nv1);
				fp.read = 1;
				fvars.set(nv1.id,fp);
				this.addExpr(vfun,{ e : hxsl.TExprDef.TBinop(haxe.macro.Binop.OpAssign,{ e : hxsl.TExprDef.TVar(nv1), t : v1.type, p : vfun.expr.p},{ e : hxsl.TExprDef.TVar(v1), t : v1.type, p : vfun.expr.p}), t : v1.type, p : vfun.expr.p});
				this.varMap.set(v1,nv1);
				inf1.local = true;
				break;
			case 3:
				if(inf1.write > 0) {
					var nv2 = { id : hxsl.Tools.allocVarId(), name : v1.name, kind : hxsl.VarKind.Local, type : v1.type};
					this.uniqueName(nv2);
					finits.push({ e : hxsl.TExprDef.TVarDecl(nv2,{ e : hxsl.TExprDef.TVar(v1), t : v1.type, p : ffun.expr.p}), t : hxsl.Type.TVoid, p : ffun.expr.p});
					this.varMap.set(v1,nv2);
				} else {
				}
				break;
			default:
			}
		}
		var $it2 = vvars.iterator();
		while( $it2.hasNext() ) {
			var v2 = $it2.next();
			this.checkVar(v2,true,vvars);
		}
		var $it3 = fvars.iterator();
		while( $it3.hasNext() ) {
			var v3 = $it3.next();
			this.checkVar(v3,false,vvars);
		}
		var $it4 = this.varMap.keys();
		while( $it4.hasNext() ) {
			var v4 = $it4.next();
			var v21;
			var key = this.varMap.h[v4.__id__];
			v21 = this.varMap.h[key.__id__];
			if(v21 != null) this.varMap.set(v4,v21);
		}
		ffun = { ret : ffun.ret, ref : ffun.ref, kind : ffun.kind, args : ffun.args, expr : this.mapVars(ffun.expr)};
		{
			var _g6 = ffun.expr.e;
			switch(_g6[1]) {
			case 4:
				var el = _g6[2];
				var _g11 = 0;
				while(_g11 < finits.length) {
					var e1 = finits[_g11];
					++_g11;
					el.unshift(e1);
				}
				break;
			default:
				finits.push(ffun.expr);
				ffun.expr = { e : hxsl.TExprDef.TBlock(finits), t : hxsl.Type.TVoid, p : ffun.expr.p};
			}
		}
		var vvars1;
		var _g7 = [];
		var $it5 = vvars.iterator();
		while( $it5.hasNext() ) {
			var v5 = $it5.next();
			if(!v5.local) _g7.push(v5.v);
		}
		vvars1 = _g7;
		vvars1.sort(function(v11,v22) {
			return v11.id - v22.id;
		});
		return { vertex : { name : "vertex", vars : vvars1, funs : [vfun]}, fragment : { name : "fragment", vars : (function($this) {
			var $r;
			var _g12 = [];
			var $it6 = fvars.iterator();
			while( $it6.hasNext() ) {
				var v6 = $it6.next();
				if(!v6.local) _g12.push(v6.v);
			}
			$r = _g12;
			return $r;
		}(this)), funs : [ffun]}};
	}
	,addExpr: function(f,e) {
		{
			var _g = f.expr.e;
			switch(_g[1]) {
			case 4:
				var el = _g[2];
				el.push(e);
				break;
			default:
				f.expr = { e : hxsl.TExprDef.TBlock([f.expr,e]), t : hxsl.Type.TVoid, p : f.expr.p};
			}
		}
	}
	,checkVar: function(v,vertex,vvars) {
		var _g = v.v.kind;
		switch(_g[1]) {
		case 4:
			if(v.requireInit) throw "Variable " + v.v.name + " is written without being initialized"; else {
			}
			break;
		case 3:
			if(!vertex) {
				var i = vvars.get(v.v.id);
				if(i == null || i.write == 0) throw "Varying " + v.v.name + " is not written by vertex shader";
			}
			break;
		default:
		}
	}
	,mapVars: function(e) {
		{
			var _g = e.e;
			switch(_g[1]) {
			case 1:
				var v = _g[2];
				var v2 = this.varMap.h[v.__id__];
				if(v2 == null) return e; else return { e : hxsl.TExprDef.TVar(v2), t : e.t, p : e.p};
				break;
			default:
				return hxsl.Tools.map(e,$bind(this,this.mapVars));
			}
		}
	}
	,get: function(v) {
		var i = this.vars.get(v.id);
		if(i == null) {
			i = new hxsl._Splitter.VarProps(v);
			this.vars.set(v.id,i);
			this.uniqueName(v);
		}
		return i;
	}
	,uniqueName: function(v) {
		if(v.kind == hxsl.VarKind.Global || v.kind == hxsl.VarKind.Output || v.kind == hxsl.VarKind.Input) return;
		v.parent = null;
		var n = this.varNames.get(v.name);
		if(n != null && n != v) {
			var k = 2;
			while(this.varNames.exists(v.name + k)) k++;
			v.name += k;
		}
		this.varNames.set(v.name,v);
	}
	,checkExpr: function(e) {
		{
			var _g = e.e;
			switch(_g[1]) {
			case 1:
				var v = _g[2];
				var inf = this.get(v);
				if(inf.write == 0) inf.requireInit = true;
				inf.read++;
				break;
			case 5:
				switch(_g[2][1]) {
				case 4:
					switch(_g[3].e[1]) {
					case 1:
						var e1 = _g[4];
						var v1 = _g[3].e[2];
						var inf1 = this.get(v1);
						inf1.write++;
						this.checkExpr(e1);
						break;
					case 9:
						switch(_g[3].e[2].e[1]) {
						case 1:
							var e1 = _g[4];
							var v1 = _g[3].e[2].e[2];
							var inf1 = this.get(v1);
							inf1.write++;
							this.checkExpr(e1);
							break;
						default:
							hxsl.Tools.iter(e,$bind(this,this.checkExpr));
						}
						break;
					default:
						hxsl.Tools.iter(e,$bind(this,this.checkExpr));
					}
					break;
				case 20:
					switch(_g[3].e[1]) {
					case 1:
						var e2 = _g[4];
						var v2 = _g[3].e[2];
						var inf2 = this.get(v2);
						if(inf2.write == 0) inf2.requireInit = true;
						inf2.read++;
						inf2.write++;
						this.checkExpr(e2);
						break;
					case 9:
						switch(_g[3].e[2].e[1]) {
						case 1:
							var e2 = _g[4];
							var v2 = _g[3].e[2].e[2];
							var inf2 = this.get(v2);
							if(inf2.write == 0) inf2.requireInit = true;
							inf2.read++;
							inf2.write++;
							this.checkExpr(e2);
							break;
						default:
							hxsl.Tools.iter(e,$bind(this,this.checkExpr));
						}
						break;
					default:
						hxsl.Tools.iter(e,$bind(this,this.checkExpr));
					}
					break;
				default:
					hxsl.Tools.iter(e,$bind(this,this.checkExpr));
				}
				break;
			case 7:
				var init = _g[3];
				var v3 = _g[2];
				var inf3 = this.get(v3);
				inf3.local = true;
				if(init != null) {
					this.checkExpr(init);
					inf3.write++;
				}
				break;
			default:
				hxsl.Tools.iter(e,$bind(this,this.checkExpr));
			}
		}
	}
	,__class__: hxsl.Splitter
};
js.Browser = function() { };
$hxClasses["js.Browser"] = js.Browser;
js.Browser.__name__ = true;
js.Browser.getLocalStorage = function() {
	try {
		var s = window.localStorage;
		s.getItem("");
		return s;
	} catch( e ) {
		return null;
	}
};
js.html = {};
js.html._CanvasElement = {};
js.html._CanvasElement.CanvasUtil = function() { };
$hxClasses["js.html._CanvasElement.CanvasUtil"] = js.html._CanvasElement.CanvasUtil;
js.html._CanvasElement.CanvasUtil.__name__ = true;
js.html._CanvasElement.CanvasUtil.getContextWebGL = function(canvas,attribs) {
	var _g = 0;
	var _g1 = ["webgl","experimental-webgl"];
	while(_g < _g1.length) {
		var name = _g1[_g];
		++_g;
		var ctx = canvas.getContext(name,attribs);
		if(ctx != null) return ctx;
	}
	return null;
};
var motion = {};
motion.actuators = {};
motion.actuators.IGenericActuator = function() { };
$hxClasses["motion.actuators.IGenericActuator"] = motion.actuators.IGenericActuator;
motion.actuators.IGenericActuator.__name__ = true;
motion.actuators.IGenericActuator.prototype = {
	__class__: motion.actuators.IGenericActuator
};
motion.actuators.GenericActuator = function(target,duration,properties) {
	this._autoVisible = true;
	this._delay = 0;
	this._reflect = false;
	this._repeat = 0;
	this._reverse = false;
	this._smartRotation = false;
	this._snapping = false;
	this.special = false;
	this.target = target;
	this.properties = properties;
	this.duration = duration;
	this._ease = motion.Actuate.defaultEase;
};
$hxClasses["motion.actuators.GenericActuator"] = motion.actuators.GenericActuator;
motion.actuators.GenericActuator.__name__ = true;
motion.actuators.GenericActuator.__interfaces__ = [motion.actuators.IGenericActuator];
motion.actuators.GenericActuator.prototype = {
	apply: function() {
		var _g = 0;
		var _g1 = Reflect.fields(this.properties);
		while(_g < _g1.length) {
			var i = _g1[_g];
			++_g;
			if(Object.prototype.hasOwnProperty.call(this.target,i)) Reflect.setField(this.target,i,Reflect.field(this.properties,i)); else Reflect.setProperty(this.target,i,Reflect.field(this.properties,i));
		}
	}
	,autoVisible: function(value) {
		if(value == null) value = true;
		this._autoVisible = value;
		return this;
	}
	,callMethod: function(method,params) {
		if(params == null) params = [];
		return method.apply(method,params);
	}
	,change: function() {
		if(this._onUpdate != null) this.callMethod(this._onUpdate,this._onUpdateParams);
	}
	,complete: function(sendEvent) {
		if(sendEvent == null) sendEvent = true;
		if(sendEvent) {
			this.change();
			if(this._onComplete != null) this.callMethod(this._onComplete,this._onCompleteParams);
		}
		motion.Actuate.unload(this);
	}
	,delay: function(duration) {
		this._delay = duration;
		return this;
	}
	,ease: function(easing) {
		this._ease = easing;
		return this;
	}
	,move: function() {
	}
	,onComplete: function(handler,parameters) {
		this._onComplete = handler;
		if(parameters == null) this._onCompleteParams = []; else this._onCompleteParams = parameters;
		if(this.duration == 0) this.complete();
		return this;
	}
	,onRepeat: function(handler,parameters) {
		this._onRepeat = handler;
		if(parameters == null) this._onRepeatParams = []; else this._onRepeatParams = parameters;
		return this;
	}
	,onUpdate: function(handler,parameters) {
		this._onUpdate = handler;
		if(parameters == null) this._onUpdateParams = []; else this._onUpdateParams = parameters;
		return this;
	}
	,pause: function() {
	}
	,reflect: function(value) {
		if(value == null) value = true;
		this._reflect = value;
		this.special = true;
		return this;
	}
	,repeat: function(times) {
		if(times == null) times = -1;
		this._repeat = times;
		return this;
	}
	,resume: function() {
	}
	,reverse: function(value) {
		if(value == null) value = true;
		this._reverse = value;
		this.special = true;
		return this;
	}
	,smartRotation: function(value) {
		if(value == null) value = true;
		this._smartRotation = value;
		this.special = true;
		return this;
	}
	,snapping: function(value) {
		if(value == null) value = true;
		this._snapping = value;
		this.special = true;
		return this;
	}
	,stop: function(properties,complete,sendEvent) {
	}
	,__class__: motion.actuators.GenericActuator
};
motion.actuators.SimpleActuator = function(target,duration,properties) {
	this.active = true;
	this.propertyDetails = new Array();
	this.sendChange = false;
	this.paused = false;
	this.cacheVisible = false;
	this.initialized = false;
	this.setVisible = false;
	this.toggleVisible = false;
	this.startTime = haxe.Timer.stamp();
	motion.actuators.GenericActuator.call(this,target,duration,properties);
	if(!motion.actuators.SimpleActuator.addedEvent) {
		motion.actuators.SimpleActuator.addedEvent = true;
		motion.actuators.SimpleActuator.timer = new haxe.Timer(33);
		motion.actuators.SimpleActuator.timer.run = motion.actuators.SimpleActuator.stage_onEnterFrame;
	}
};
$hxClasses["motion.actuators.SimpleActuator"] = motion.actuators.SimpleActuator;
motion.actuators.SimpleActuator.__name__ = true;
motion.actuators.SimpleActuator.stage_onEnterFrame = function() {
	var currentTime = haxe.Timer.stamp();
	var actuator;
	var j = 0;
	var cleanup = false;
	var _g1 = 0;
	var _g = motion.actuators.SimpleActuator.actuatorsLength;
	while(_g1 < _g) {
		var i = _g1++;
		actuator = motion.actuators.SimpleActuator.actuators[j];
		if(actuator != null && actuator.active) {
			if(currentTime > actuator.timeOffset) actuator.update(currentTime);
			j++;
		} else {
			motion.actuators.SimpleActuator.actuators.splice(j,1);
			--motion.actuators.SimpleActuator.actuatorsLength;
		}
	}
};
motion.actuators.SimpleActuator.__super__ = motion.actuators.GenericActuator;
motion.actuators.SimpleActuator.prototype = $extend(motion.actuators.GenericActuator.prototype,{
	autoVisible: function(value) {
		if(value == null) value = true;
		this._autoVisible = value;
		if(!value) {
			this.toggleVisible = false;
			if(this.setVisible) this.setField(this.target,"visible",this.cacheVisible);
		}
		return this;
	}
	,delay: function(duration) {
		this._delay = duration;
		this.timeOffset = this.startTime + duration;
		return this;
	}
	,getField: function(target,propertyName) {
		var value = null;
		if(Object.prototype.hasOwnProperty.call(target,propertyName)) value = Reflect.field(target,propertyName); else value = Reflect.getProperty(target,propertyName);
		return value;
	}
	,initialize: function() {
		var details;
		var start;
		var _g = 0;
		var _g1 = Reflect.fields(this.properties);
		while(_g < _g1.length) {
			var i = _g1[_g];
			++_g;
			var isField = true;
			if(Object.prototype.hasOwnProperty.call(this.target,i)) start = Reflect.field(this.target,i); else {
				isField = false;
				start = Reflect.getProperty(this.target,i);
			}
			if(typeof(start) == "number") {
				details = new motion.actuators.PropertyDetails(this.target,i,start,this.getField(this.properties,i) - start,isField);
				this.propertyDetails.push(details);
			}
		}
		this.detailsLength = this.propertyDetails.length;
		this.initialized = true;
	}
	,move: function() {
		this.toggleVisible = Object.prototype.hasOwnProperty.call(this.properties,"alpha") && Object.prototype.hasOwnProperty.call(this.properties,"visible");
		if(this.toggleVisible && this.properties.alpha != 0 && !this.getField(this.target,"visible")) {
			this.setVisible = true;
			this.cacheVisible = this.getField(this.target,"visible");
			this.setField(this.target,"visible",true);
		}
		this.timeOffset = this.startTime;
		motion.actuators.SimpleActuator.actuators.push(this);
		++motion.actuators.SimpleActuator.actuatorsLength;
	}
	,onUpdate: function(handler,parameters) {
		this._onUpdate = handler;
		if(parameters == null) this._onUpdateParams = []; else this._onUpdateParams = parameters;
		this.sendChange = true;
		return this;
	}
	,pause: function() {
		this.paused = true;
		this.pauseTime = haxe.Timer.stamp();
	}
	,resume: function() {
		if(this.paused) {
			this.paused = false;
			this.timeOffset += (haxe.Timer.stamp() - this.pauseTime) / 1000;
		}
	}
	,setField: function(target,propertyName,value) {
		if(Object.prototype.hasOwnProperty.call(target,propertyName)) target[propertyName] = value; else Reflect.setProperty(target,propertyName,value);
	}
	,setProperty: function(details,value) {
		if(details.isField) details.target[details.propertyName] = value; else Reflect.setProperty(details.target,details.propertyName,value);
	}
	,stop: function(properties,complete,sendEvent) {
		if(this.active) {
			if(properties == null) {
				this.active = false;
				if(complete) this.apply();
				this.complete(sendEvent);
				return;
			}
			var _g = 0;
			var _g1 = Reflect.fields(properties);
			while(_g < _g1.length) {
				var i = _g1[_g];
				++_g;
				if(Object.prototype.hasOwnProperty.call(this.properties,i)) {
					this.active = false;
					if(complete) this.apply();
					this.complete(sendEvent);
					return;
				}
			}
		}
	}
	,update: function(currentTime) {
		if(!this.paused) {
			var details;
			var easing;
			var i;
			var tweenPosition = (currentTime - this.timeOffset) / this.duration;
			if(tweenPosition > 1) tweenPosition = 1;
			if(!this.initialized) this.initialize();
			if(!this.special) {
				easing = this._ease.calculate(tweenPosition);
				var _g1 = 0;
				var _g = this.detailsLength;
				while(_g1 < _g) {
					var i1 = _g1++;
					details = this.propertyDetails[i1];
					this.setProperty(details,details.start + details.change * easing);
				}
			} else {
				if(!this._reverse) easing = this._ease.calculate(tweenPosition); else easing = this._ease.calculate(1 - tweenPosition);
				var endValue;
				var _g11 = 0;
				var _g2 = this.detailsLength;
				while(_g11 < _g2) {
					var i2 = _g11++;
					details = this.propertyDetails[i2];
					if(this._smartRotation && (details.propertyName == "rotation" || details.propertyName == "rotationX" || details.propertyName == "rotationY" || details.propertyName == "rotationZ")) {
						var rotation = details.change % 360;
						if(rotation > 180) rotation -= 360; else if(rotation < -180) rotation += 360;
						endValue = details.start + rotation * easing;
					} else endValue = details.start + details.change * easing;
					if(!this._snapping) {
						if(details.isField) details.target[details.propertyName] = endValue; else Reflect.setProperty(details.target,details.propertyName,endValue);
					} else this.setProperty(details,Math.round(endValue));
				}
			}
			if(tweenPosition == 1) {
				if(this._repeat == 0) {
					this.active = false;
					if(this.toggleVisible && this.getField(this.target,"alpha") == 0) this.setField(this.target,"visible",false);
					this.complete(true);
					return;
				} else {
					if(this._onRepeat != null) this.callMethod(this._onRepeat,this._onRepeatParams);
					if(this._reflect) this._reverse = !this._reverse;
					this.startTime = currentTime;
					this.timeOffset = this.startTime + this._delay;
					if(this._repeat > 0) this._repeat--;
				}
			}
			if(this.sendChange) this.change();
		}
	}
	,__class__: motion.actuators.SimpleActuator
});
motion.easing = {};
motion.easing.Expo = function() { };
$hxClasses["motion.easing.Expo"] = motion.easing.Expo;
motion.easing.Expo.__name__ = true;
motion.easing.Expo.__properties__ = {get_easeOut:"get_easeOut"}
motion.easing.Expo.get_easeOut = function() {
	return new motion.easing.ExpoEaseOut();
};
motion.easing.IEasing = function() { };
$hxClasses["motion.easing.IEasing"] = motion.easing.IEasing;
motion.easing.IEasing.__name__ = true;
motion.easing.IEasing.prototype = {
	__class__: motion.easing.IEasing
};
motion.easing.ExpoEaseOut = function() {
};
$hxClasses["motion.easing.ExpoEaseOut"] = motion.easing.ExpoEaseOut;
motion.easing.ExpoEaseOut.__name__ = true;
motion.easing.ExpoEaseOut.__interfaces__ = [motion.easing.IEasing];
motion.easing.ExpoEaseOut.prototype = {
	calculate: function(k) {
		if(k == 1) return 1; else return 1 - Math.pow(2,-10 * k);
	}
	,__class__: motion.easing.ExpoEaseOut
};
motion.Actuate = function() { };
$hxClasses["motion.Actuate"] = motion.Actuate;
motion.Actuate.__name__ = true;
motion.Actuate.apply = function(target,properties,customActuator) {
	motion.Actuate.stop(target,properties);
	if(customActuator == null) customActuator = motion.Actuate.defaultActuator;
	var actuator = Type.createInstance(customActuator,[target,0,properties]);
	actuator.apply();
	return actuator;
};
motion.Actuate.getLibrary = function(target,allowCreation) {
	if(allowCreation == null) allowCreation = true;
	if(!motion.Actuate.targetLibraries.exists(target) && allowCreation) motion.Actuate.targetLibraries.set(target,new Array());
	return motion.Actuate.targetLibraries.get(target);
};
motion.Actuate.stop = function(target,properties,complete,sendEvent) {
	if(sendEvent == null) sendEvent = true;
	if(complete == null) complete = false;
	if(target != null) {
		if(js.Boot.__instanceof(target,motion.actuators.GenericActuator)) (js.Boot.__cast(target , motion.actuators.GenericActuator)).stop(null,complete,sendEvent); else {
			var library = motion.Actuate.getLibrary(target,false);
			if(library != null) {
				if(typeof(properties) == "string") {
					var temp = { };
					Reflect.setField(temp,properties,null);
					properties = temp;
				} else if((properties instanceof Array) && properties.__enum__ == null) {
					var temp1 = { };
					var _g = 0;
					var _g1;
					_g1 = js.Boot.__cast(properties , Array);
					while(_g < _g1.length) {
						var property = _g1[_g];
						++_g;
						Reflect.setField(temp1,property,null);
					}
					properties = temp1;
				}
				var i = library.length - 1;
				while(i >= 0) {
					library[i].stop(properties,complete,sendEvent);
					i--;
				}
			}
		}
	}
};
motion.Actuate.tween = function(target,duration,properties,overwrite,customActuator) {
	if(overwrite == null) overwrite = true;
	if(target != null) {
		if(duration > 0) {
			if(customActuator == null) customActuator = motion.Actuate.defaultActuator;
			var actuator = Type.createInstance(customActuator,[target,duration,properties]);
			var library = motion.Actuate.getLibrary(actuator.target);
			if(overwrite) {
				var i = library.length - 1;
				while(i >= 0) {
					library[i].stop(actuator.properties,false,false);
					i--;
				}
				library = motion.Actuate.getLibrary(actuator.target);
			}
			library.push(actuator);
			actuator.move();
			return actuator;
		} else return motion.Actuate.apply(target,properties,customActuator);
	}
	return null;
};
motion.Actuate.unload = function(actuator) {
	var target = actuator.target;
	if(motion.Actuate.targetLibraries.h.__keys__[target.__id__] != null) {
		HxOverrides.remove(motion.Actuate.targetLibraries.h[target.__id__],actuator);
		if(motion.Actuate.targetLibraries.h[target.__id__].length == 0) motion.Actuate.targetLibraries.remove(target);
	}
};
motion.Actuate.update = function(target,duration,start,end,overwrite) {
	if(overwrite == null) overwrite = true;
	var properties = { start : start, end : end};
	return motion.Actuate.tween(target,duration,properties,overwrite,motion.actuators.MethodActuator);
};
motion.IComponentPath = function() { };
$hxClasses["motion.IComponentPath"] = motion.IComponentPath;
motion.IComponentPath.__name__ = true;
motion.IComponentPath.prototype = {
	__class__: motion.IComponentPath
};
motion.actuators.MethodActuator = function(target,duration,properties) {
	this.currentParameters = new Array();
	this.tweenProperties = { };
	motion.actuators.SimpleActuator.call(this,target,duration,properties);
	if(!Object.prototype.hasOwnProperty.call(properties,"start")) this.properties.start = new Array();
	if(!Object.prototype.hasOwnProperty.call(properties,"end")) this.properties.end = this.properties.start;
	var _g1 = 0;
	var _g = this.properties.start.length;
	while(_g1 < _g) {
		var i = _g1++;
		this.currentParameters.push(null);
	}
};
$hxClasses["motion.actuators.MethodActuator"] = motion.actuators.MethodActuator;
motion.actuators.MethodActuator.__name__ = true;
motion.actuators.MethodActuator.__super__ = motion.actuators.SimpleActuator;
motion.actuators.MethodActuator.prototype = $extend(motion.actuators.SimpleActuator.prototype,{
	apply: function() {
		this.callMethod(this.target,this.properties.end);
	}
	,complete: function(sendEvent) {
		if(sendEvent == null) sendEvent = true;
		var _g1 = 0;
		var _g = this.properties.start.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.currentParameters[i] = Reflect.field(this.tweenProperties,"param" + i);
		}
		this.callMethod(this.target,this.currentParameters);
		motion.actuators.SimpleActuator.prototype.complete.call(this,sendEvent);
	}
	,initialize: function() {
		var details;
		var propertyName;
		var start;
		var _g1 = 0;
		var _g = this.properties.start.length;
		while(_g1 < _g) {
			var i = _g1++;
			propertyName = "param" + i;
			start = this.properties.start[i];
			this.tweenProperties[propertyName] = start;
			if(typeof(start) == "number" || ((start | 0) === start)) {
				details = new motion.actuators.PropertyDetails(this.tweenProperties,propertyName,start,this.properties.end[i] - start);
				this.propertyDetails.push(details);
			}
		}
		this.detailsLength = this.propertyDetails.length;
		this.initialized = true;
	}
	,update: function(currentTime) {
		motion.actuators.SimpleActuator.prototype.update.call(this,currentTime);
		if(this.active) {
			var _g1 = 0;
			var _g = this.properties.start.length;
			while(_g1 < _g) {
				var i = _g1++;
				this.currentParameters[i] = Reflect.field(this.tweenProperties,"param" + i);
			}
			this.callMethod(this.target,this.currentParameters);
		}
	}
	,__class__: motion.actuators.MethodActuator
});
motion.actuators.MotionPathActuator = function(target,duration,properties) {
	motion.actuators.SimpleActuator.call(this,target,duration,properties);
};
$hxClasses["motion.actuators.MotionPathActuator"] = motion.actuators.MotionPathActuator;
motion.actuators.MotionPathActuator.__name__ = true;
motion.actuators.MotionPathActuator.__super__ = motion.actuators.SimpleActuator;
motion.actuators.MotionPathActuator.prototype = $extend(motion.actuators.SimpleActuator.prototype,{
	apply: function() {
		var _g = 0;
		var _g1 = Reflect.fields(this.properties);
		while(_g < _g1.length) {
			var propertyName = _g1[_g];
			++_g;
			if(Object.prototype.hasOwnProperty.call(this.target,propertyName)) Reflect.setField(this.target,propertyName,(js.Boot.__cast(Reflect.field(this.properties,propertyName) , motion.IComponentPath)).get_end()); else Reflect.setProperty(this.target,propertyName,(js.Boot.__cast(Reflect.field(this.properties,propertyName) , motion.IComponentPath)).get_end());
		}
	}
	,initialize: function() {
		var details;
		var path;
		var _g = 0;
		var _g1 = Reflect.fields(this.properties);
		while(_g < _g1.length) {
			var propertyName = _g1[_g];
			++_g;
			path = js.Boot.__cast(Reflect.field(this.properties,propertyName) , motion.IComponentPath);
			if(path != null) {
				var isField = true;
				if(Object.prototype.hasOwnProperty.call(this.target,propertyName)) path.start = Reflect.field(this.target,propertyName); else {
					isField = false;
					path.start = Reflect.getProperty(this.target,propertyName);
				}
				details = new motion.actuators.PropertyPathDetails(this.target,propertyName,path,isField);
				this.propertyDetails.push(details);
			}
		}
		this.detailsLength = this.propertyDetails.length;
		this.initialized = true;
	}
	,update: function(currentTime) {
		if(!this.paused) {
			var details;
			var easing;
			var tweenPosition = (currentTime - this.timeOffset) / this.duration;
			if(tweenPosition > 1) tweenPosition = 1;
			if(!this.initialized) this.initialize();
			if(!this.special) {
				easing = this._ease.calculate(tweenPosition);
				var _g = 0;
				var _g1 = this.propertyDetails;
				while(_g < _g1.length) {
					var details1 = _g1[_g];
					++_g;
					if(details1.isField) Reflect.setField(details1.target,details1.propertyName,(js.Boot.__cast(details1 , motion.actuators.PropertyPathDetails)).path.calculate(easing)); else Reflect.setProperty(details1.target,details1.propertyName,(js.Boot.__cast(details1 , motion.actuators.PropertyPathDetails)).path.calculate(easing));
				}
			} else {
				if(!this._reverse) easing = this._ease.calculate(tweenPosition); else easing = this._ease.calculate(1 - tweenPosition);
				var endValue;
				var _g2 = 0;
				var _g11 = this.propertyDetails;
				while(_g2 < _g11.length) {
					var details2 = _g11[_g2];
					++_g2;
					if(!this._snapping) {
						if(details2.isField) Reflect.setField(details2.target,details2.propertyName,(js.Boot.__cast(details2 , motion.actuators.PropertyPathDetails)).path.calculate(easing)); else Reflect.setProperty(details2.target,details2.propertyName,(js.Boot.__cast(details2 , motion.actuators.PropertyPathDetails)).path.calculate(easing));
					} else if(details2.isField) Reflect.setField(details2.target,details2.propertyName,Math.round((js.Boot.__cast(details2 , motion.actuators.PropertyPathDetails)).path.calculate(easing))); else Reflect.setProperty(details2.target,details2.propertyName,Math.round((js.Boot.__cast(details2 , motion.actuators.PropertyPathDetails)).path.calculate(easing)));
				}
			}
			if(tweenPosition == 1) {
				if(this._repeat == 0) {
					this.active = false;
					if(this.toggleVisible && this.getField(this.target,"alpha") == 0) this.setField(this.target,"visible",false);
					this.complete(true);
					return;
				} else {
					if(this._reflect) this._reverse = !this._reverse;
					this.startTime = currentTime;
					this.timeOffset = this.startTime + this._delay;
					if(this._repeat > 0) this._repeat--;
				}
			}
			if(this.sendChange) this.change();
		}
	}
	,__class__: motion.actuators.MotionPathActuator
});
motion.actuators.PropertyDetails = function(target,propertyName,start,change,isField) {
	if(isField == null) isField = true;
	this.target = target;
	this.propertyName = propertyName;
	this.start = start;
	this.change = change;
	this.isField = isField;
};
$hxClasses["motion.actuators.PropertyDetails"] = motion.actuators.PropertyDetails;
motion.actuators.PropertyDetails.__name__ = true;
motion.actuators.PropertyDetails.prototype = {
	__class__: motion.actuators.PropertyDetails
};
motion.actuators.PropertyPathDetails = function(target,propertyName,path,isField) {
	if(isField == null) isField = true;
	motion.actuators.PropertyDetails.call(this,target,propertyName,0,0,isField);
	this.path = path;
};
$hxClasses["motion.actuators.PropertyPathDetails"] = motion.actuators.PropertyPathDetails;
motion.actuators.PropertyPathDetails.__name__ = true;
motion.actuators.PropertyPathDetails.__super__ = motion.actuators.PropertyDetails;
motion.actuators.PropertyPathDetails.prototype = $extend(motion.actuators.PropertyDetails.prototype,{
	__class__: motion.actuators.PropertyPathDetails
});
motion.easing.Linear = function() { };
$hxClasses["motion.easing.Linear"] = motion.easing.Linear;
motion.easing.Linear.__name__ = true;
motion.easing.Linear.__properties__ = {get_easeNone:"get_easeNone"}
motion.easing.Linear.get_easeNone = function() {
	return new motion.easing.LinearEaseNone();
};
motion.easing.LinearEaseNone = function() {
};
$hxClasses["motion.easing.LinearEaseNone"] = motion.easing.LinearEaseNone;
motion.easing.LinearEaseNone.__name__ = true;
motion.easing.LinearEaseNone.__interfaces__ = [motion.easing.IEasing];
motion.easing.LinearEaseNone.prototype = {
	calculate: function(k) {
		return k;
	}
	,__class__: motion.easing.LinearEaseNone
};
motion.easing.Quad = function() { };
$hxClasses["motion.easing.Quad"] = motion.easing.Quad;
motion.easing.Quad.__name__ = true;
motion.easing.Quad.__properties__ = {get_easeIn:"get_easeIn"}
motion.easing.Quad.get_easeIn = function() {
	return new motion.easing.QuadEaseIn();
};
motion.easing.QuadEaseIn = function() {
};
$hxClasses["motion.easing.QuadEaseIn"] = motion.easing.QuadEaseIn;
motion.easing.QuadEaseIn.__name__ = true;
motion.easing.QuadEaseIn.__interfaces__ = [motion.easing.IEasing];
motion.easing.QuadEaseIn.prototype = {
	calculate: function(k) {
		return k * k;
	}
	,__class__: motion.easing.QuadEaseIn
};
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = true;
$hxClasses.Array = Array;
Array.__name__ = true;
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
Xml.Element = "element";
Xml.PCData = "pcdata";
Xml.CData = "cdata";
Xml.Comment = "comment";
Xml.DocType = "doctype";
Xml.ProcessingInstruction = "processingInstruction";
Xml.Document = "document";
box2D.dynamics.B2ContactListener.b2_defaultListener = new box2D.dynamics.B2ContactListener();
box2D.dynamics.B2World.s_timestep2 = new box2D.dynamics.B2TimeStep();
box2D.dynamics.B2World.s_backupA = new box2D.common.math.B2Sweep();
box2D.dynamics.B2World.s_backupB = new box2D.common.math.B2Sweep();
box2D.dynamics.B2World.s_timestep = new box2D.dynamics.B2TimeStep();
box2D.dynamics.B2World.s_queue = new Array();
box2D.dynamics.B2World.e_newFixture = 1;
box2D.dynamics.B2World.e_locked = 2;
box2D.dynamics.B2ContactFilter.b2_defaultFilter = new box2D.dynamics.B2ContactFilter();
box2D.common.B2Settings.b2_pi = Math.PI;
box2D.common.B2Settings.b2_maxManifoldPoints = 2;
box2D.common.B2Settings.b2_aabbExtension = 0.1;
box2D.common.B2Settings.b2_aabbMultiplier = 2.0;
box2D.common.B2Settings.b2_linearSlop = 0.005;
box2D.common.B2Settings.b2_maxTOIContactsPerIsland = 32;
box2D.common.B2Settings.b2_maxTOIJointsPerIsland = 32;
box2D.common.B2Settings.b2_velocityThreshold = 1.0;
box2D.common.B2Settings.b2_maxLinearCorrection = 0.2;
box2D.common.B2Settings.b2_maxTranslation = 2.0;
box2D.common.B2Settings.b2_maxTranslationSquared = box2D.common.B2Settings.b2_maxTranslation * box2D.common.B2Settings.b2_maxTranslation;
box2D.common.B2Settings.b2_maxRotation = 0.5 * box2D.common.B2Settings.b2_pi;
box2D.common.B2Settings.b2_maxRotationSquared = box2D.common.B2Settings.b2_maxRotation * box2D.common.B2Settings.b2_maxRotation;
box2D.common.B2Settings.b2_contactBaumgarte = 0.2;
box2D.common.B2Settings.b2_timeToSleep = 0.5;
box2D.common.B2Settings.b2_linearSleepTolerance = 0.01;
box2D.common.B2Settings.b2_angularSleepTolerance = 0.011111111111111112 * box2D.common.B2Settings.b2_pi;
box2D.dynamics.contacts.B2ContactSolver.s_worldManifold = new box2D.collision.B2WorldManifold();
box2D.dynamics.contacts.B2ContactSolver.s_psm = new box2D.dynamics.contacts.B2PositionSolverManifold();
box2D.dynamics.B2Island.s_impulse = new box2D.dynamics.B2ContactImpulse();
box2D.dynamics.B2Body.s_xf1 = new box2D.common.math.B2Transform();
box2D.dynamics.B2Body.e_islandFlag = 1;
box2D.dynamics.B2Body.e_awakeFlag = 2;
box2D.dynamics.B2Body.e_allowSleepFlag = 4;
box2D.dynamics.B2Body.e_bulletFlag = 8;
box2D.dynamics.B2Body.e_fixedRotationFlag = 16;
box2D.dynamics.B2Body.e_activeFlag = 32;
box2D.dynamics.B2Body.b2_staticBody = 0;
box2D.dynamics.B2Body.b2_kinematicBody = 1;
box2D.dynamics.B2Body.b2_dynamicBody = 2;
Main.world = new box2D.dynamics.B2World(new box2D.common.math.B2Vec2(0,-250),true);
Main.maxLevel = 3;
box2D.collision.B2Collision.s_incidentEdge = box2D.collision.B2Collision.makeClipPointVector();
box2D.collision.B2Collision.s_clipPoints1 = box2D.collision.B2Collision.makeClipPointVector();
box2D.collision.B2Collision.s_clipPoints2 = box2D.collision.B2Collision.makeClipPointVector();
box2D.collision.B2Collision.s_edgeAO = new Array();
box2D.collision.B2Collision.s_edgeBO = new Array();
box2D.collision.B2Collision.s_localTangent = new box2D.common.math.B2Vec2();
box2D.collision.B2Collision.s_localNormal = new box2D.common.math.B2Vec2();
box2D.collision.B2Collision.s_planePoint = new box2D.common.math.B2Vec2();
box2D.collision.B2Collision.s_normal = new box2D.common.math.B2Vec2();
box2D.collision.B2Collision.s_tangent = new box2D.common.math.B2Vec2();
box2D.collision.B2Collision.s_tangent2 = new box2D.common.math.B2Vec2();
box2D.collision.B2Collision.s_v11 = new box2D.common.math.B2Vec2();
box2D.collision.B2Collision.s_v12 = new box2D.common.math.B2Vec2();
box2D.collision.B2Distance.s_simplex = new box2D.collision.B2Simplex();
box2D.collision.B2Distance.s_saveA = new Array();
box2D.collision.B2Distance.s_saveB = new Array();
box2D.collision.B2DynamicTreeNode.currentID = 0;
box2D.collision.B2TimeOfImpact.b2_toiCalls = 0;
box2D.collision.B2TimeOfImpact.b2_toiIters = 0;
box2D.collision.B2TimeOfImpact.b2_toiMaxIters = 0;
box2D.collision.B2TimeOfImpact.b2_toiRootIters = 0;
box2D.collision.B2TimeOfImpact.b2_toiMaxRootIters = 0;
box2D.collision.B2TimeOfImpact.s_cache = new box2D.collision.B2SimplexCache();
box2D.collision.B2TimeOfImpact.s_distanceInput = new box2D.collision.B2DistanceInput();
box2D.collision.B2TimeOfImpact.s_xfA = new box2D.common.math.B2Transform();
box2D.collision.B2TimeOfImpact.s_xfB = new box2D.common.math.B2Transform();
box2D.collision.B2TimeOfImpact.s_fcn = new box2D.collision.B2SeparationFunction();
box2D.collision.B2TimeOfImpact.s_distanceOutput = new box2D.collision.B2DistanceOutput();
box2D.dynamics.contacts.B2Contact.e_sensorFlag = 1;
box2D.dynamics.contacts.B2Contact.e_continuousFlag = 2;
box2D.dynamics.contacts.B2Contact.e_islandFlag = 4;
box2D.dynamics.contacts.B2Contact.e_toiFlag = 8;
box2D.dynamics.contacts.B2Contact.e_touchingFlag = 16;
box2D.dynamics.contacts.B2Contact.e_enabledFlag = 32;
box2D.dynamics.contacts.B2Contact.e_filterFlag = 64;
box2D.dynamics.contacts.B2Contact.s_input = new box2D.collision.B2TOIInput();
format.tools.InflateImpl.LEN_EXTRA_BITS_TBL = [0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,-1,-1];
format.tools.InflateImpl.LEN_BASE_VAL_TBL = [3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258];
format.tools.InflateImpl.DIST_EXTRA_BITS_TBL = [0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,-1,-1];
format.tools.InflateImpl.DIST_BASE_VAL_TBL = [1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577];
format.tools.InflateImpl.CODE_LENGTHS_POS = [16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];
h3d.Buffer.GUID = 0;
h3d.BufferOffset.UID = 0;
h3d.impl.GlDriver.TFILTERS = [[[9728,9728],[9729,9729]],[[9728,9984],[9729,9985]],[[9728,9986],[9729,9987]]];
h3d.impl.GlDriver.TWRAP = [33071,10497];
h3d.impl.GlDriver.FACES = [0,1028,1029,1032];
h3d.impl.GlDriver.BLEND = [1,0,770,768,772,774,771,769,773,775,32769,32771,32770,32772,776];
h3d.impl.GlDriver.COMPARE = [519,512,514,517,516,518,513,515];
h3d.impl.GlDriver.OP = [32774,32778,32779];
h3d.impl.MemoryManager.ALL_FLAGS = Type.allEnums(h3d.BufferFlag);
h3d.mat.Texture.UID = 0;
h3d.mat.Texture.COLOR_CACHE = new haxe.ds.IntMap();
hxd.res.Resource.LIVE_UPDATE = false;
haxe.Unserializer.DEFAULT_RESOLVER = Type;
haxe.Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
h3d.shader.Shadow.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:3:0y4:namey9:shadowPosy4:typejy9:hxsl.Type:5:2i3jy12:hxsl.VecType:1:0y10:qualifiersajy17:hxsl.VarQualifier:1:0hy2:idi-154gy1:poy4:filey64:C%3A%5CUsers%5CAlix%5CDesktop%5Cheaps%5Ch3d%2Fshader%2FShadow.hxy3:maxi341y3:mini332gy1:tr12goR3jR4:5:3jR5:0:0oR3jR4:5:3jR5:1:0oR3jR4:5:3r20oR3jR4:1:1oR6jR7:4:0R8y19:transformedPositionR10jR11:5:2i3r11R15i-153gR16oR17R18R19i363R20i344gR21r25goR3jR4:1:1oR6jR7:0:0R8y4:projR10jR11:8:0y6:parentoR6r30R8y6:shadowR10jR11:12:1aoR6r30R8y3:mapR10jR11:10:0R24r32R15i-147gr29oR6r30R8y5:colorR10jR11:5:2i3r11R24r32R15i-149goR6r30R8y5:powerR10jR11:3:0R24r32R15i-150goR6r30R8y4:biasR10r39R24r32R15i-151ghR15i-146gR15i-148gR16oR17R18R19i377R20i366gR21r31gR16oR17R18R19i377R20i344gR21jR11:5:2i3r11goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:38:0R16oR17R18R19i384R20i380gR21jR11:13:1ahgaoR3jR4:0:1jy10:hxsl.Const:3:1d0.5R16oR17R18R19i388R20i385gR21r39goR3jR4:0:1jR31:3:1d0.5R16oR17R18R19i414R20i411gR21r39goR3jR4:0:1jR31:3:1d0.999R16oR17R18R19i426R20i421gR21r39ghR16oR17R18R19i427R20i380gR21jR11:5:2i3r11gR16oR17R18R19i427R20i344gR21jR11:5:2i3r11goR3jR4:8:2oR3jR4:2:1r49R16oR17R18R19i434R20i430gR21r53gaoR3jR4:0:1jR31:3:1d0.5R16oR17R18R19i438R20i435gR21r39goR3jR4:0:1jR31:3:1d0.5R16oR17R18R19i443R20i440gR21r39goR3jR4:0:1jR31:3:1zR16oR17R18R19i446R20i445gR21r39ghR16oR17R18R19i447R20i430gR21jR11:5:2i3r11gR16oR17R18R19i447R20i344gR21jR11:5:2i3r11gR16oR17R18R19i447R20i332gR21r12ghR16oR17R18R19i453R20i326gR21jR11:0:0gR6jy17:hxsl.FunctionKind:0:0y3:refoR6jR7:6:0R8y6:vertexR10jR11:13:1aoR1ahy3:retr100ghR15i-155gR35r100goR1ahR2oR3jR4:4:1aoR3jR4:7:2oR6r24R8y5:depthR10r39R15i-157goR3jR4:8:2oR3jR4:2:1jR30:52:0R16oR17R18R19i503R20i497gR21jR11:13:1aoR1aoR8y5:valueR10jR11:5:2i4r11ghR35r39ghgaoR3jR4:8:2oR3jR4:2:1jR30:32:0R16oR17R18R19i514R20i504gR21jR11:13:1aoR1aoR8y1:_R10r35goR8y1:bR10jR11:5:2i2r11ghR35jR11:5:2i4r11ghgaoR3jR4:1:1r34R16oR17R18R19i514R20i504gR21r35goR3jR4:9:2oR3jR4:1:1r9R16oR17R18R19i528R20i519gR21r12gajy14:hxsl.Component:0:0jR40:1:0hR16oR17R18R19i531R20i519gR21jR11:5:2i2r11ghR16oR17R18R19i532R20i504gR21r137ghR16oR17R18R19i533R20i497gR21r39gR16oR17R18R19i534R20i485gR21r100goR3jR4:7:2oR6r24R8y5:shadeR10r39R15i-158goR3jR4:8:2oR3jR4:2:1jR30:23:0R16oR17R18R19i608R20i551gR21jR11:13:1aoR1aoR8R38R10r39goR8R20R10r39goR8R19R10r39ghR35r39ghgaoR3jR4:8:2oR3jR4:2:1jR30:9:0R16oR17R18R19i554R20i551gR21jR11:13:1aoR1aoR8R37R10r39ghR35r39ghgaoR3jR4:5:3r20oR3jR4:1:1r38R16oR17R18R19i568R20i556gR21r39goR3jR4:3:1oR3jR4:5:3r18oR3jR4:5:3jR5:3:0oR3jR4:1:1r113R16oR17R18R19i577R20i572gR21r39goR3jR4:9:2oR3jR4:1:1r9R16oR17R18R19i589R20i580gR21r12gajR40:2:0hR16oR17R18R19i591R20i580gR21r39gR16oR17R18R19i591R20i572gR21r39goR3jR4:1:1r40R16oR17R18R19i605R20i594gR21r39gR16oR17R18R19i605R20i572gR21r39gR16oR17R18R19i606R20i571gR21r39gR16oR17R18R19i606R20i556gR21r39ghR16oR17R18R19i608R20i551gR21r39goR3jR4:0:1jR31:3:1d0R16oR17R18R19i617R20i615gR21r39goR3jR4:0:1jR31:3:1d1R16oR17R18R19i620R20i618gR21r39ghR16oR17R18R19i621R20i551gR21r39gR16oR17R18R19i622R20i539gR21r100goR3jR4:5:3jR5:20:1r20oR3jR4:9:2oR3jR4:1:1oR6r24R8y10:pixelColorR10jR11:5:2i4r11R15i-152gR16oR17R18R19i637R20i627gR21r234gar148r149r201hR16oR17R18R19i641R20i627gR21jR11:5:2i3r11goR3jR4:5:3r18oR3jR4:5:3r20oR3jR4:3:1oR3jR4:5:3r192oR3jR4:0:1jR31:3:1d1R16oR17R18R19i648R20i646gR21r39goR3jR4:1:1r160R16oR17R18R19i656R20i651gR21r39gR16oR17R18R19i656R20i646gR21r39gR16oR17R18R19i657R20i645gR21r39goR3jR4:9:2oR3jR4:1:1r36R16oR17R18R19i672R20i660gR21r37gar148r149r201hR16oR17R18R19i676R20i660gR21jR11:5:2i3r11gR16oR17R18R19i676R20i645gR21r263goR3jR4:1:1r160R16oR17R18R19i684R20i679gR21r39gR16oR17R18R19i684R20i645gR21r263gR16oR17R18R19i684R20i627gR21r240ghR16oR17R18R19i690R20i479gR21r100gR6jR32:1:0R33oR6r103R8y8:fragmentR10jR11:13:1aoR1ahR35r100ghR15i-156gR35r100ghR8y17:h3d.shader.Shadowy4:varsar102r276r32r9r23r233hg";
hxsl.Tools.UID = 0;
hxsl.Tools.SWIZ = Type.allEnums(hxsl.Component);
h3d.shader.AlphaMap.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:20:1jR5:1:0oR3jR4:9:2oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey10:pixelColory4:typejy9:hxsl.Type:5:2i4jy12:hxsl.VecType:1:0y2:idi-131gy1:poy4:filey66:C%3A%5CUsers%5CAlix%5CDesktop%5Cheaps%5Ch3d%2Fshader%2FAlphaMap.hxy3:maxi271y3:mini261gy1:tr14gajy14:hxsl.Component:3:0hR14oR15R16R17i273R18i261gR19jR11:3:0goR3jR4:9:2oR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:32:0R14oR15R16R17i284R18i277gR19jR11:13:1aoR1aoR8y1:_R10jR11:10:0goR8y1:bR10jR11:5:2i2r13ghy3:retjR11:5:2i4r13ghgaoR3jR4:1:1oR6jR7:2:0R8y7:textureR10r32R13i-132gR14oR15R16R17i284R18i277gR19r32goR3jR4:5:3jR5:0:0oR3jR4:5:3r7oR3jR4:1:1oR6r12R8y12:calculatedUVR10jR11:5:2i2r13R13i-130gR14oR15R16R17i301R18i289gR19r48goR3jR4:1:1oR6r40R8y7:uvScaleR10jR11:5:2i2r13R13i-133gR14oR15R16R17i311R18i304gR19r53gR14oR15R16R17i311R18i289gR19jR11:5:2i2r13goR3jR4:1:1oR6r40R8y7:uvDeltaR10jR11:5:2i2r13R13i-134gR14oR15R16R17i321R18i314gR19r61gR14oR15R16R17i321R18i289gR19jR11:5:2i2r13ghR14oR15R16R17i322R18i277gR19r35gajR20:2:0hR14oR15R16R17i324R18i277gR19r21gR14oR15R16R17i324R18i261gR19r21ghR14oR15R16R17i330R18i255gR19jR11:0:0gR6jy17:hxsl.FunctionKind:1:0y3:refoR6jR7:6:0R8y8:fragmentR10jR11:13:1aoR1ahR24r77ghR13i-135gR24r77ghR8y19:h3d.shader.AlphaMapy4:varsar47r79r39r52r11r60hg";
h3d.shader.AmbientLight.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey10:lightColory4:typejy9:hxsl.Type:5:2i3jy12:hxsl.VecType:1:0y2:idi-6gy1:poy4:filey70:C%3A%5CUsers%5CAlix%5CDesktop%5Cheaps%5Ch3d%2Fshader%2FAmbientLight.hxy3:maxi316y3:mini306gy1:tr12goR3jR4:1:1oR6jR7:0:0R8y12:ambientLightR10jR11:5:2i3r11y6:parentoR6r17R8y6:globalR10jR11:12:1ar16oR6r17R8y16:perPixelLightingR10jR11:2:0R21r19y10:qualifiersajy17:hxsl.VarQualifier:0:1nhR13i-3ghR13i-1gR13i-2gR14oR15R16R17i338R18i319gR19r18gR14oR15R16R17i338R18i306gR19r12ghR14oR15R16R17i344R18i300gR19jR11:0:0gR6jy17:hxsl.FunctionKind:2:0y3:refoR6jR7:6:0R8y8:__init__R10jR11:13:1aoR1ahy3:retr32ghR13i-7gR29r32goR1ahR2oR3jR4:4:1aoR3jR4:5:3r7oR3jR4:1:1oR6r10R8y15:lightPixelColorR10jR11:5:2i3r11R13i-5gR14oR15R16R17i399R18i384gR19r47goR3jR4:1:1r16R14oR15R16R17i421R18i402gR19r18gR14oR15R16R17i421R18i384gR19r47ghR14oR15R16R17i427R18i378gR19r32gR6jR26:1:0R27oR6r35R8y16:__init__fragmentR10jR11:13:1aoR1ahR29r32ghR13i-8gR29r32goR1ahR2oR3jR4:4:1aoR3jR4:10:3oR3jR4:6:2jy15:haxe.macro.Unop:2:0oR3jR4:1:1r21R14oR15R16R17i485R18i462gR19r22gR14oR15R16R17i485R18i461gR19r22goR3jR4:5:3jR5:20:1jR5:1:0oR3jR4:9:2oR3jR4:1:1oR6r10R8y10:pixelColorR10jR11:5:2i4r11R13i-4gR14oR15R16R17i498R18i488gR19r81gajy14:hxsl.Component:0:0jR34:1:0jR34:2:0hR14oR15R16R17i502R18i488gR19jR11:5:2i3r11goR3jR4:1:1r9R14oR15R16R17i516R18i506gR19r12gR14oR15R16R17i516R18i488gR19r90gnR14oR15R16R17i516R18i457gR19r32ghR14oR15R16R17i522R18i451gR19r32gR6jR26:0:0R27oR6r35R8y6:vertexR10jR11:13:1aoR1ahR29r32ghR13i-9gR29r32goR1ahR2oR3jR4:4:1aoR3jR4:10:3oR3jR4:1:1r21R14oR15R16R17i581R18i558gR19r22goR3jR4:5:3jR5:20:1r76oR3jR4:9:2oR3jR4:1:1r80R14oR15R16R17i594R18i584gR19r81gar85r86r87hR14oR15R16R17i598R18i584gR19jR11:5:2i3r11goR3jR4:1:1r46R14oR15R16R17i617R18i602gR19r47gR14oR15R16R17i617R18i584gR19r123gnR14oR15R16R17i617R18i554gR19r32ghR14oR15R16R17i623R18i548gR19r32gR6r57R27oR6r35R8y8:fragmentR10jR11:13:1aoR1ahR29r32ghR13i-10gR29r32ghR8y23:h3d.shader.AmbientLighty4:varsar101r9r34r133r58r19r80r46hg";
h3d.shader.Base2d.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey14:spritePositiony4:typejy9:hxsl.Type:5:2i4jy12:hxsl.VecType:1:0y2:idi-70gy1:poy4:filey64:C%3A%5CUsers%5CAlix%5CDesktop%5Cheaps%5Ch3d%2Fshader%2FBase2d.hxy3:maxi662y3:mini648gy1:tr12goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:39:0R14oR15R16R17i669R18i665gR19jR11:13:1ahgaoR3jR4:1:1oR6jR7:1:0R8y8:positionR10jR11:5:2i2r11y6:parentoR6r25R8y5:inputR10jR11:12:1ar24oR6r25R8y2:uvR10jR11:5:2i2r11R22r27R13i-63goR6r25R8y5:colorR10jR11:5:2i4r11R22r27R13i-64ghR13i-61gR13i-62gR14oR15R16R17i684R18i670gR19r26goR3jR4:1:1oR6jR7:2:0R8y6:zValueR10jR11:3:0R13i-68gR14oR15R16R17i692R18i686gR19r39goR3jR4:0:1jy10:hxsl.Const:3:1i1R14oR15R16R17i695R18i694gR19r39ghR14oR15R16R17i696R18i665gR19jR11:5:2i4r11gR14oR15R16R17i696R18i648gR19r12goR3jR4:10:3oR3jR4:1:1oR6r38R8y10:isRelativeR10jR11:2:0y10:qualifiersajy17:hxsl.VarQualifier:0:1nhR13i-75gR14oR15R16R17i716R18i706gR19r54goR3jR4:4:1aoR3jR4:5:3r7oR3jR4:9:2oR3jR4:1:1oR6r10R8y16:absolutePositionR10jR11:5:2i4r11R13i-71gR14oR15R16R17i742R18i726gR19r65gajy14:hxsl.Component:0:0hR14oR15R16R17i744R18i726gR19r39goR3jR4:8:2oR3jR4:2:1jR20:29:0R14oR15R16R17i772R18i747gR19jR11:13:1aoR1aoR8y1:_R10jR11:5:2i3r11goR8y1:bR10jR11:5:2i3r11ghy3:retr39ghgaoR3jR4:8:2oR3jR4:2:1jR20:38:0R14oR15R16R17i751R18i747gR19jR11:13:1ahgaoR3jR4:9:2oR3jR4:1:1r9R14oR15R16R17i766R18i752gR19r12gar69jR32:1:0hR14oR15R16R17i769R18i752gR19jR11:5:2i2r11goR3jR4:0:1jR27:3:1i1R14oR15R16R17i771R18i770gR19r39ghR14oR15R16R17i772R18i747gR19r81goR3jR4:1:1oR6r38R8y15:absoluteMatrixAR10jR11:5:2i3r11R13i-77gR14oR15R16R17i792R18i777gR19r111ghR14oR15R16R17i793R18i747gR19r39gR14oR15R16R17i793R18i726gR19r39goR3jR4:5:3r7oR3jR4:9:2oR3jR4:1:1r64R14oR15R16R17i816R18i800gR19r65gar99hR14oR15R16R17i818R18i800gR19r39goR3jR4:8:2oR3jR4:2:1r74R14oR15R16R17i846R18i821gR19jR11:13:1aoR1aoR8R33R10jR11:5:2i3r11gr82hR35r39ghgaoR3jR4:8:2oR3jR4:2:1r88R14oR15R16R17i825R18i821gR19r92gaoR3jR4:9:2oR3jR4:1:1r9R14oR15R16R17i840R18i826gR19r12gar69r99hR14oR15R16R17i843R18i826gR19jR11:5:2i2r11goR3jR4:0:1jR27:3:1i1R14oR15R16R17i845R18i844gR19r39ghR14oR15R16R17i846R18i821gR19r134goR3jR4:1:1oR6r38R8y15:absoluteMatrixBR10jR11:5:2i3r11R13i-78gR14oR15R16R17i866R18i851gR19r158ghR14oR15R16R17i867R18i821gR19r39gR14oR15R16R17i867R18i800gR19r39goR3jR4:5:3r7oR3jR4:9:2oR3jR4:1:1r64R14oR15R16R17i890R18i874gR19r65gajR32:2:0jR32:3:0hR14oR15R16R17i893R18i874gR19jR11:5:2i2r11goR3jR4:9:2oR3jR4:1:1r9R14oR15R16R17i910R18i896gR19r12gar171r172hR14oR15R16R17i913R18i896gR19jR11:5:2i2r11gR14oR15R16R17i913R18i874gR19r175ghR14oR15R16R17i920R18i719gR19jR11:0:0goR3jR4:5:3r7oR3jR4:1:1r64R14oR15R16R17i947R18i931gR19r65goR3jR4:1:1r9R14oR15R16R17i964R18i950gR19r12gR14oR15R16R17i964R18i931gR19r65gR14oR15R16R17i964R18i702gR19r188goR3jR4:5:3r7oR3jR4:1:1oR6jR7:3:0R8y12:calculatedUVR10jR11:5:2i2r11R13i-74gR14oR15R16R17i982R18i970gR19r204goR3jR4:1:1r29R14oR15R16R17i993R18i985gR19r30gR14oR15R16R17i993R18i970gR19r204goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y10:pixelColorR10jR11:5:2i4r11R13i-72gR14oR15R16R17i1009R18i999gR19r215goR3jR4:10:3oR3jR4:1:1r53R14oR15R16R17i1022R18i1012gR19r54goR3jR4:5:3jR5:1:0oR3jR4:1:1oR6r38R8R25R10jR11:5:2i4r11R13i-76gR14oR15R16R17i1030R18i1025gR19r226goR3jR4:1:1r31R14oR15R16R17i1044R18i1033gR19r32gR14oR15R16R17i1044R18i1025gR19jR11:5:2i4r11goR3jR4:1:1r31R14oR15R16R17i1058R18i1047gR19r32gR14oR15R16R17i1058R18i1012gR19r234gR14oR15R16R17i1058R18i999gR19r215goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y12:textureColorR10jR11:5:2i4r11R13i-73gR14oR15R16R17i1076R18i1064gR19r245goR3jR4:8:2oR3jR4:2:1jR20:32:0R14oR15R16R17i1086R18i1079gR19jR11:13:1aoR1aoR8R33R10jR11:10:0goR8R34R10jR11:5:2i2r11ghR35jR11:5:2i4r11ghgaoR3jR4:1:1oR6r38R8y7:textureR10r257R13i-69gR14oR15R16R17i1086R18i1079gR19r257goR3jR4:1:1r202R14oR15R16R17i1103R18i1091gR19r204ghR14oR15R16R17i1104R18i1079gR19r260gR14oR15R16R17i1104R18i1064gR19r245goR3jR4:5:3jR5:20:1r223oR3jR4:1:1r214R14oR15R16R17i1120R18i1110gR19r215goR3jR4:1:1r244R14oR15R16R17i1136R18i1124gR19r245gR14oR15R16R17i1136R18i1110gR19r215ghR14oR15R16R17i1142R18i642gR19r188gR6jy17:hxsl.FunctionKind:2:0y3:refoR6jR7:6:0R8y8:__init__R10jR11:13:1aoR1ahR35r188ghR13i-79gR35r188goR1ahR2oR3jR4:4:1aoR3jR4:5:3r7oR3jR4:1:1oR6jR7:5:0R8R21R10jR11:5:2i4r11R22oR6r300R8y6:outputR10jR11:12:1ar299oR6r300R8R25R10jR11:5:2i4r11R22r302R13i-67ghR13i-65gR13i-66gR14oR15R16R17i1189R18i1174gR19r301goR3jR4:1:1r64R14oR15R16R17i1208R18i1192gR19r65gR14oR15R16R17i1208R18i1174gR19r301ghR14oR15R16R17i1214R18i1168gR19r188gR6jR42:0:0R43oR6r288R8y6:vertexR10jR11:13:1aoR1ahR35r188ghR13i-80gR35r188goR1ahR2oR3jR4:4:1aoR3jR4:5:3r7oR3jR4:1:1r304R14oR15R16R17i1260R18i1248gR19r305goR3jR4:1:1r214R14oR15R16R17i1273R18i1263gR19r215gR14oR15R16R17i1273R18i1248gR19r305ghR14oR15R16R17i1279R18i1242gR19r188gR6jR42:1:0R43oR6r288R8y8:fragmentR10jR11:13:1aoR1ahR35r188ghR13i-81gR35r188ghR8y17:h3d.shader.Base2dy4:varsar202r317r37r110r287r64r338r264r244r9r302r53r157r27r225r214hg";
h3d.shader.BaseMesh.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey19:transformedPositiony4:typejy9:hxsl.Type:5:2i3jy12:hxsl.VecType:1:0y2:idi-42gy1:poy4:filey66:C%3A%5CUsers%5CAlix%5CDesktop%5Cheaps%5Ch3d%2Fshader%2FBaseMesh.hxy3:maxi918y3:mini899gy1:tr12goR3jR4:5:3jR5:1:0oR3jR4:1:1oR6jR7:1:0R8y8:positionR10jR11:5:2i3r11y6:parentoR6r19R8y5:inputR10jR11:12:1ar18oR6r19R8y6:normalR10jR11:5:2i3r11R21r21R13i-37ghR13i-35gR13i-36gR14oR15R16R17i935R18i921gR19r20goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:49:0R14oR15R16R17i954R18i938gR19jR11:13:1ahgaoR3jR4:1:1oR6jR7:0:0R8y9:modelViewR10jR11:7:0R21oR6r38R8y6:globalR10jR11:12:1aoR6r38R8y4:timeR10jR11:3:0R21r40R13i-31goR6r38R8y5:flipYR10r43R21r40R13i-32gr37oR6r38R8y16:modelViewInverseR10r39R21r40y10:qualifiersajy17:hxsl.VarQualifier:3:0hR13i-34ghR13i-30gR30ar47hR13i-33gR14oR15R16R17i954R18i938gR19r39ghR14oR15R16R17i963R18i938gR19jR11:8:0gR14oR15R16R17i963R18i921gR19jR11:5:2i3r11gR14oR15R16R17i963R18i899gR19r12goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y17:projectedPositionR10jR11:5:2i4r11R13i-44gR14oR15R16R17i986R18i969gR19r63goR3jR4:5:3r16oR3jR4:8:2oR3jR4:2:1jR24:39:0R14oR15R16R17i993R18i989gR19jR11:13:1ahgaoR3jR4:1:1r9R14oR15R16R17i1013R18i994gR19r12goR3jR4:0:1jy10:hxsl.Const:3:1i1R14oR15R16R17i1016R18i1015gR19r43ghR14oR15R16R17i1017R18i989gR19jR11:5:2i4r11goR3jR4:1:1oR6r38R8y8:viewProjR10r39R21oR6r38R8y6:cameraR10jR11:12:1aoR6r38R8y4:viewR10r39R21r87R13i-23goR6r38R8y4:projR10r39R21r87R13i-24goR6r38R8R20R10jR11:5:2i3r11R21r87R13i-25goR6r38R8y8:projDiagR10jR11:5:2i3r11R21r87R13i-26gr86oR6r38R8y15:inverseViewProjR10r39R21r87R13i-28goR6jR7:3:0R8y3:dirR10jR11:5:2i3r11R21r87R13i-29ghR13i-22gR13i-27gR14oR15R16R17i1035R18i1020gR19r39gR14oR15R16R17i1035R18i989gR19jR11:5:2i4r11gR14oR15R16R17i1035R18i969gR19r63goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y17:transformedNormalR10jR11:5:2i3r11R13i-43gR14oR15R16R17i1058R18i1041gR19r110goR3jR4:8:2oR3jR4:2:1jR24:31:0R14oR15R16R17i1108R18i1061gR19jR11:13:1aoR1aoR8y1:_R10r57ghy3:retr57ghgaoR3jR4:3:1oR3jR4:5:3r16oR3jR4:1:1r23R14oR15R16R17i1074R18i1062gR19r24goR3jR4:8:2oR3jR4:2:1jR24:47:0R14oR15R16R17i1100R18i1077gR19jR11:13:1ahgaoR3jR4:1:1r45R14oR15R16R17i1100R18i1077gR19r39ghR14oR15R16R17i1107R18i1077gR19jR11:6:0gR14oR15R16R17i1107R18i1062gR19r57gR14oR15R16R17i1108R18i1061gR19r57ghR14oR15R16R17i1120R18i1061gR19r57gR14oR15R16R17i1120R18i1041gR19r110goR3jR4:5:3r7oR3jR4:1:1r96R14oR15R16R17i1136R18i1126gR19r98goR3jR4:8:2oR3jR4:2:1r115R14oR15R16R17i1178R18i1139gR19jR11:13:1aoR1aoR8R42R10jR11:5:2i3r11ghR43r57ghgaoR3jR4:3:1oR3jR4:5:3jR5:3:0oR3jR4:1:1r91R14oR15R16R17i1155R18i1140gR19r92goR3jR4:1:1r9R14oR15R16R17i1177R18i1158gR19r12gR14oR15R16R17i1177R18i1140gR19r163gR14oR15R16R17i1178R18i1139gR19r163ghR14oR15R16R17i1190R18i1139gR19r57gR14oR15R16R17i1190R18i1126gR19r98goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y10:pixelColorR10jR11:5:2i4r11R13i-45gR14oR15R16R17i1206R18i1196gR19r186goR3jR4:1:1oR6jR7:2:0R8y5:colorR10jR11:5:2i4r11R13i-47gR14oR15R16R17i1214R18i1209gR19r192gR14oR15R16R17i1214R18i1196gR19r186goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y5:depthR10r43R13i-46gR14oR15R16R17i1225R18i1220gR19r43goR3jR4:5:3jR5:2:0oR3jR4:9:2oR3jR4:1:1r62R14oR15R16R17i1245R18i1228gR19r63gajy14:hxsl.Component:2:0hR14oR15R16R17i1247R18i1228gR19r43goR3jR4:9:2oR3jR4:1:1r62R14oR15R16R17i1267R18i1250gR19r63gajR47:3:0hR14oR15R16R17i1269R18i1250gR19r43gR14oR15R16R17i1269R18i1228gR19r43gR14oR15R16R17i1269R18i1220gR19r43ghR14oR15R16R17i1275R18i893gR19jR11:0:0gR6jy17:hxsl.FunctionKind:2:0y3:refoR6jR7:6:0R8y8:__init__R10jR11:13:1aoR1ahR43r226ghR13i-48gR43r226goR1ahR2oR3jR4:4:1aoR3jR4:5:3r7oR3jR4:1:1oR6jR7:5:0R8R20R10jR11:5:2i4r11R21oR6r241R8y6:outputR10jR11:12:1ar240oR6r241R8R45R10jR11:5:2i4r11R21r243R13i-40goR6r241R8y8:distanceR10jR11:5:2i4r11R21r243R13i-41ghR13i-38gR13i-39gR14oR15R16R17i1320R18i1305gR19r242goR3jR4:1:1r62R14oR15R16R17i1340R18i1323gR19r63gR14oR15R16R17i1340R18i1305gR19r242goR3jR4:5:3jR5:20:1r16oR3jR4:9:2oR3jR4:1:1r240R14oR15R16R17i1446R18i1431gR19r242gajR47:1:0hR14oR15R16R17i1448R18i1431gR19r43goR3jR4:1:1r44R14oR15R16R17i1464R18i1452gR19r43gR14oR15R16R17i1464R18i1431gR19r43ghR14oR15R16R17i1479R18i1299gR19r226gR6jR48:0:0R49oR6r229R8y6:vertexR10jR11:13:1aoR1ahR43r226ghR13i-49gR43r226goR1ahR2oR3jR4:4:1aoR3jR4:5:3r7oR3jR4:1:1r245R14oR15R16R17i1523R18i1511gR19r246goR3jR4:1:1r185R14oR15R16R17i1536R18i1526gR19r186gR14oR15R16R17i1536R18i1511gR19r246goR3jR4:5:3r7oR3jR4:1:1r247R14oR15R16R17i1557R18i1542gR19r248goR3jR4:8:2oR3jR4:2:1jR24:51:0R14oR15R16R17i1564R18i1560gR19jR11:13:1aoR1aoR8y5:valueR10r43ghR43jR11:5:2i4r11ghgaoR3jR4:1:1r199R14oR15R16R17i1570R18i1565gR19r43ghR14oR15R16R17i1571R18i1560gR19r306gR14oR15R16R17i1571R18i1542gR19r248ghR14oR15R16R17i1577R18i1505gR19r226gR6jR48:1:0R49oR6r229R8y8:fragmentR10jR11:13:1aoR1ahR43r226ghR13i-50gR43r226ghR8y19:h3d.shader.BaseMeshy4:varsar62r199r275r109r228r319r87r243r40r21r9r190r185hg";
h3d.shader.Blur.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:5:0y4:namey8:positiony4:typejy9:hxsl.Type:5:2i4jy12:hxsl.VecType:1:0y6:parentoR6r10R8y6:outputR10jR11:12:1ar9oR6r10R8y5:colorR10jR11:5:2i4r11R13r13y2:idi-87ghR16i-85gR16i-86gy1:poy4:filey62:C%3A%5CUsers%5CAlix%5CDesktop%5Cheaps%5Ch3d%2Fshader%2FBlur.hxy3:maxi435y3:mini420gy1:tr12goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:39:0R17oR18R19R20i442R21i438gR22jR11:13:1ahgaoR3jR4:1:1oR6jR7:1:0R8R9R10jR11:5:2i2r11R13oR6r30R8y5:inputR10jR11:12:1ar29oR6r30R8y2:uvR10jR11:5:2i2r11R13r32R16i-84ghR16i-82gR16i-83gR17oR18R19R20i457R21i443gR22r31goR3jR4:0:1jy10:hxsl.Const:3:1zR17oR18R19R20i460R21i459gR22jR11:3:0goR3jR4:0:1jR26:3:1i1R17oR18R19R20i463R21i462gR22r43ghR17oR18R19R20i464R21i438gR22jR11:5:2i4r11gR17oR18R19R20i464R21i420gR22r12ghR17oR18R19R20i470R21i414gR22jR11:0:0gR6jy17:hxsl.FunctionKind:0:0y3:refoR6jR7:6:0R8y6:vertexR10jR11:13:1aoR1ahy3:retr55ghR16i-93gR30r55goR1ahR2oR3jR4:4:1aoR3jR4:10:3oR3jR4:1:1oR6jR7:2:0R8y7:isDepthR10jR11:2:0y10:qualifiersajy17:hxsl.VarQualifier:0:1nhR16i-90gR17oR18R19R20i511R21i504gR22r71goR3jR4:4:1aoR3jR4:7:2oR6jR7:4:0R8y3:valR10r43R16i-95goR3jR4:0:1jR26:3:1d0R17oR18R19R20i533R21i531gR22r43gR17oR18R19R20i534R21i521gR22r55goR3jR4:13:3oR6r80R8y1:iR10jR11:1:0R16i-96goR3jR4:5:3jR5:21:0oR3jR4:5:3jR5:0:0oR3jR4:6:2jy15:haxe.macro.Unop:3:0oR3jR4:1:1oR6r70R8y7:QualityR10r89R32ajR33:0:1nhR16i-89gR17oR18R19R20i558R21i551gR22r89gR17oR18R19R20i558R21i550gR22r89goR3jR4:0:1jR26:2:1i1R17oR18R19R20i563R21i559gR22r89gR17oR18R19R20i563R21i550gR22r89goR3jR4:1:1r97R17oR18R19R20i570R21i563gR22r89gR17oR18R19R20i570R21i550gR22jR11:14:2r89jy13:hxsl.SizeDecl:0:1zgoR3jR4:5:3jR5:20:1r93oR3jR4:1:1r79R17oR18R19R20i582R21i579gR22r43goR3jR4:5:3jR5:1:0oR3jR4:8:2oR3jR4:2:1jR23:52:0R17oR18R19R20i592R21i586gR22jR11:13:1aoR1aoR8y5:valueR10jR11:5:2i4r11ghR30r43ghgaoR3jR4:8:2oR3jR4:2:1jR23:32:0R17oR18R19R20i600R21i593gR22jR11:13:1aoR1aoR8y1:_R10jR11:10:0goR8y1:bR10jR11:5:2i2r11ghR30jR11:5:2i4r11ghgaoR3jR4:1:1oR6r70R8y7:textureR10r145R16i-88gR17oR18R19R20i600R21i593gR22r145goR3jR4:5:3r93oR3jR4:1:1r34R17oR18R19R20i613R21i605gR22r35goR3jR4:5:3r123oR3jR4:1:1oR6r70R8y5:pixelR10jR11:5:2i2r11R16i-92gR17oR18R19R20i621R21i616gR22r162goR3jR4:8:2oR3jR4:2:1jR23:35:0R17oR18R19R20i629R21i624gR22jR11:13:1aoR1aoR8R39R10r89ghR30r43ghgaoR3jR4:1:1r88R17oR18R19R20i631R21i630gR22r89ghR17oR18R19R20i632R21i624gR22r43gR17oR18R19R20i632R21i616gR22r162gR17oR18R19R20i632R21i605gR22jR11:5:2i2r11ghR17oR18R19R20i633R21i593gR22r148ghR17oR18R19R20i634R21i586gR22r43goR3jR4:16:2oR3jR4:1:1oR6r70R8y6:valuesR10jR11:14:2r43jR38:1:1r97R16i-91gR17oR18R19R20i643R21i637gR22r194goR3jR4:10:3oR3jR4:5:3jR5:9:0oR3jR4:1:1r88R17oR18R19R20i645R21i644gR22r89goR3jR4:0:1jR26:2:1zR17oR18R19R20i649R21i648gR22r89gR17oR18R19R20i649R21i644gR22r71goR3jR4:6:2r95oR3jR4:1:1r88R17oR18R19R20i654R21i653gR22r89gR17oR18R19R20i654R21i652gR22r89goR3jR4:1:1r88R17oR18R19R20i658R21i657gR22r89gR17oR18R19R20i658R21i644gR22r89gR17oR18R19R20i659R21i637gR22r43gR17oR18R19R20i659R21i586gR22r43gR17oR18R19R20i659R21i579gR22r43gR17oR18R19R20i659R21i540gR22r55goR3jR4:5:3r7oR3jR4:1:1r15R17oR18R19R20i678R21i666gR22r16goR3jR4:8:2oR3jR4:2:1jR23:51:0R17oR18R19R20i685R21i681gR22jR11:13:1aoR1aoR8R39R10r43ghR30jR11:5:2i4r11ghgaoR3jR4:8:2oR3jR4:2:1jR23:21:0R17oR18R19R20i689R21i686gR22jR11:13:1aoR1aoR8R40R10r43goR8R41R10r43ghR30r43ghgaoR3jR4:1:1r79R17oR18R19R20i689R21i686gR22r43goR3jR4:0:1jR26:3:1d0.9999999R17oR18R19R20i703R21i694gR22r43ghR17oR18R19R20i704R21i686gR22r43ghR17oR18R19R20i705R21i681gR22r241gR17oR18R19R20i705R21i666gR22r16ghR17oR18R19R20i712R21i514gR22r55goR3jR4:4:1aoR3jR4:7:2oR6r80R8R15R10jR11:5:2i4r11R16i-97goR3jR4:8:2oR3jR4:2:1r22R17oR18R19R20i741R21i737gR22r26gaoR3jR4:0:1jR26:3:1zR17oR18R19R20i743R21i742gR22r43goR3jR4:0:1jR26:3:1zR17oR18R19R20i746R21i745gR22r43goR3jR4:0:1jR26:3:1zR17oR18R19R20i749R21i748gR22r43goR3jR4:0:1jR26:3:1zR17oR18R19R20i752R21i751gR22r43ghR17oR18R19R20i753R21i737gR22r275gR17oR18R19R20i754R21i725gR22r55goR3jR4:13:3oR6r80R8R35R10r89R16i-98goR3jR4:5:3r91oR3jR4:5:3r93oR3jR4:6:2r95oR3jR4:1:1r97R17oR18R19R20i778R21i771gR22r89gR17oR18R19R20i778R21i770gR22r89goR3jR4:0:1jR26:2:1i1R17oR18R19R20i783R21i779gR22r89gR17oR18R19R20i783R21i770gR22r89goR3jR4:1:1r97R17oR18R19R20i790R21i783gR22r89gR17oR18R19R20i790R21i770gR22jR11:14:2r89jR38:0:1zgoR3jR4:5:3jR5:20:1r93oR3jR4:1:1r274R17oR18R19R20i804R21i799gR22r275goR3jR4:5:3r123oR3jR4:8:2oR3jR4:2:1r138R17oR18R19R20i815R21i808gR22jR11:13:1aoR1aoR8R40R10r145gr146hR30r148ghgaoR3jR4:1:1r152R17oR18R19R20i815R21i808gR22r145goR3jR4:5:3r93oR3jR4:1:1r34R17oR18R19R20i828R21i820gR22r35goR3jR4:5:3r123oR3jR4:1:1r161R17oR18R19R20i836R21i831gR22r162goR3jR4:8:2oR3jR4:2:1r167R17oR18R19R20i844R21i839gR22jR11:13:1ar171hgaoR3jR4:1:1r302R17oR18R19R20i846R21i845gR22r89ghR17oR18R19R20i847R21i839gR22r43gR17oR18R19R20i847R21i831gR22r162gR17oR18R19R20i847R21i820gR22jR11:5:2i2r11ghR17oR18R19R20i848R21i808gR22r148goR3jR4:16:2oR3jR4:1:1r192R17oR18R19R20i857R21i851gR22r194goR3jR4:10:3oR3jR4:5:3r199oR3jR4:1:1r302R17oR18R19R20i859R21i858gR22r89goR3jR4:0:1jR26:2:1zR17oR18R19R20i863R21i862gR22r89gR17oR18R19R20i863R21i858gR22r71goR3jR4:6:2r95oR3jR4:1:1r302R17oR18R19R20i868R21i867gR22r89gR17oR18R19R20i868R21i866gR22r89goR3jR4:1:1r302R17oR18R19R20i872R21i871gR22r89gR17oR18R19R20i872R21i858gR22r89gR17oR18R19R20i873R21i851gR22r43gR17oR18R19R20i873R21i808gR22r148gR17oR18R19R20i873R21i799gR22r275gR17oR18R19R20i873R21i760gR22r55goR3jR4:5:3r7oR3jR4:1:1r15R17oR18R19R20i892R21i880gR22r16goR3jR4:1:1r274R17oR18R19R20i900R21i895gR22r275gR17oR18R19R20i900R21i880gR22r16ghR17oR18R19R20i907R21i718gR22r55gR17oR18R19R20i907R21i500gR22r55ghR17oR18R19R20i912R21i494gR22r55gR6jR27:1:0R28oR6r58R8y8:fragmentR10jR11:13:1aoR1ahR30r55ghR16i-94gR30r55ghR8y15:h3d.shader.Blury4:varsar57r97r161r192r420r152r69r13r32hg";
h3d.shader.Clear.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:5:0y4:namey8:positiony4:typejy9:hxsl.Type:5:2i4jy12:hxsl.VecType:1:0y6:parentoR6r10R8y6:outputR10jR11:12:1ar9oR6r10R8y5:colorR10jR11:5:2i4r11R13r13y2:idi-103ghR16i-101gR16i-102gy1:poy4:filey63:C%3A%5CUsers%5CAlix%5CDesktop%5Cheaps%5Ch3d%2Fshader%2FClear.hxy3:maxi297y3:mini282gy1:tr12goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:39:0R17oR18R19R20i304R21i300gR22jR11:13:1ahgaoR3jR4:1:1oR6jR7:1:0R8R9R10jR11:5:2i2r11R13oR6r30R8y5:inputR10jR11:12:1ar29hR16i-99gR16i-100gR17oR18R19R20i319R21i305gR22r31goR3jR4:1:1oR6jR7:2:0R8y5:depthR10jR11:3:0R16i-104gR17oR18R19R20i326R21i321gR22r40goR3jR4:0:1jy10:hxsl.Const:3:1i1R17oR18R19R20i329R21i328gR22r40ghR17oR18R19R20i330R21i300gR22jR11:5:2i4r11gR17oR18R19R20i330R21i282gR22r12ghR17oR18R19R20i336R21i276gR22jR11:0:0gR6jy17:hxsl.FunctionKind:0:0y3:refoR6jR7:6:0R8y6:vertexR10jR11:13:1aoR1ahy3:retr54ghR16i-106gR30r54goR1ahR2oR3jR4:4:1aoR3jR4:5:3r7oR3jR4:1:1r15R17oR18R19R20i378R21i366gR22r16goR3jR4:1:1oR6r39R8R15R10jR11:5:2i4r11R16i-105gR17oR18R19R20i386R21i381gR22r72gR17oR18R19R20i386R21i366gR22r16ghR17oR18R19R20i392R21i360gR22r54gR6jR27:1:0R28oR6r57R8y8:fragmentR10jR11:13:1aoR1ahR30r54ghR16i-107gR30r54ghR8y16:h3d.shader.Cleary4:varsar38r56r80r13r32r71hg";
h3d.shader.ColorAdd.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:20:1jR5:0:0oR3jR4:9:2oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey10:pixelColory4:typejy9:hxsl.Type:5:2i4jy12:hxsl.VecType:1:0y2:idi-136gy1:poy4:filey66:C%3A%5CUsers%5CAlix%5CDesktop%5Cheaps%5Ch3d%2Fshader%2FColorAdd.hxy3:maxi180y3:mini170gy1:tr14gajy14:hxsl.Component:0:0jR20:1:0jR20:2:0hR14oR15R16R17i184R18i170gR19jR11:5:2i3r13goR3jR4:1:1oR6jR7:2:0R8y5:colorR10jR11:5:2i3r13R13i-137gR14oR15R16R17i193R18i188gR19r27gR14oR15R16R17i193R18i170gR19r23ghR14oR15R16R17i199R18i164gR19jR11:0:0gR6jy17:hxsl.FunctionKind:1:0y3:refoR6jR7:6:0R8y8:fragmentR10jR11:13:1aoR1ahy3:retr34ghR13i-138gR25r34ghR8y19:h3d.shader.ColorAddy4:varsar36r25r11hg";
h3d.shader.ColorKey.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:7:2oy4:kindjy12:hxsl.VarKind:4:0y4:namey5:cdiffy4:typejy9:hxsl.Type:5:2i4jy12:hxsl.VecType:1:0y2:idi-142goR3jR4:5:3jy16:haxe.macro.Binop:3:0oR3jR4:1:1oR5r8R7y12:textureColorR9jR10:5:2i4r9R12i-140gy1:poy4:filey66:C%3A%5CUsers%5CAlix%5CDesktop%5Cheaps%5Ch3d%2Fshader%2FColorKey.hxy3:maxi197y3:mini185gy1:tr15goR3jR4:1:1oR5jR6:2:0R7y8:colorKeyR9jR10:5:2i4r9R12i-139gR15oR16R17R18i208R19i200gR20r21gR15oR16R17R18i208R19i185gR20r10gR15oR16R17R18i209R19i173gR20jR10:0:0goR3jR4:10:3oR3jR4:5:3jR13:9:0oR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:29:0R15oR16R17R18i223R19i218gR20jR10:13:1aoR1aoR7y1:_R9r10goR7y1:bR9jR10:5:2i4r9ghy3:retjR10:3:0ghgaoR3jR4:1:1r7R15oR16R17R18i223R19i218gR20r10goR3jR4:1:1r7R15oR16R17R18i233R19i228gR20r10ghR15oR16R17R18i234R19i218gR20r43goR3jR4:0:1jy10:hxsl.Const:3:1d1e-005R15oR16R17R18i244R19i237gR20r43gR15oR16R17R18i244R19i218gR20jR10:2:0goR3jR4:11:0R15oR16R17R18i254R19i247gR20r28gnR15oR16R17R18i254R19i214gR20r28ghR15oR16R17R18i260R19i167gR20r28gR5jy17:hxsl.FunctionKind:1:0y3:refoR5jR6:6:0R7y8:fragmentR9jR10:13:1aoR1ahR25r28ghR12i-141gR25r28ghR7y19:h3d.shader.ColorKeyy4:varsar69r19r14hg";
h3d.shader.ColorMatrix.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:20:1jR5:1:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey10:pixelColory4:typejy9:hxsl.Type:5:2i4jy12:hxsl.VecType:1:0y2:idi-143gy1:poy4:filey69:C%3A%5CUsers%5CAlix%5CDesktop%5Cheaps%5Ch3d%2Fshader%2FColorMatrix.hxy3:maxi184y3:mini174gy1:tr13goR3jR4:1:1oR6jR7:2:0R8y6:matrixR10jR11:7:0R13i-144gR14oR15R16R17i194R18i188gR19r19gR14oR15R16R17i194R18i174gR19r13ghR14oR15R16R17i200R18i168gR19jR11:0:0gR6jy17:hxsl.FunctionKind:1:0y3:refoR6jR7:6:0R8y8:fragmentR10jR11:13:1aoR1ahy3:retr26ghR13i-145gR24r26ghR8y22:h3d.shader.ColorMatrixy4:varsar28r17r10hg";
h3d.shader.DirLight.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:20:1jR5:0:0oR3jR4:9:2oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey10:lightColory4:typejy9:hxsl.Type:5:2i3jy12:hxsl.VecType:1:0y2:idi-110gy1:poy4:filey66:C%3A%5CUsers%5CAlix%5CDesktop%5Cheaps%5Ch3d%2Fshader%2FDirLight.hxy3:maxi274y3:mini264gy1:tr14gajy14:hxsl.Component:0:0jR20:1:0jR20:2:0hR14oR15R16R17i278R18i264gR19jR11:5:2i3r13goR3jR4:5:3jR5:1:0oR3jR4:1:1oR6jR7:2:0R8y5:colorR10jR11:5:2i3r13R13i-108gR14oR15R16R17i287R18i282gR19r29goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:22:0R14oR15R16R17i322R18i290gR19jR11:13:1aoR1aoR8y1:_R10jR11:3:0goR8y1:bR10r41ghy3:retr41ghgaoR3jR4:8:2oR3jR4:2:1jR22:29:0R14oR15R16R17i307R18i290gR19jR11:13:1aoR1aoR8R23R10jR11:5:2i3r13goR8R24R10jR11:5:2i3r13ghR25r41ghgaoR3jR4:1:1oR6r12R8y17:transformedNormalR10r54R13i-112gR14oR15R16R17i307R18i290gR19r54goR3jR4:1:1oR6r28R8y9:directionR10jR11:5:2i3r13R13i-109gR14oR15R16R17i321R18i312gR19r65ghR14oR15R16R17i322R18i290gR19r41goR3jR4:0:1jy10:hxsl.Const:3:1d0R14oR15R16R17i329R18i327gR19r41ghR14oR15R16R17i330R18i290gR19r41gR14oR15R16R17i330R18i282gR19r29gR14oR15R16R17i330R18i264gR19r23ghR14oR15R16R17i336R18i258gR19jR11:0:0gR6jy17:hxsl.FunctionKind:0:0y3:refoR6jR7:6:0R8y6:vertexR10jR11:13:1aoR1ahR25r82ghR13i-113gR25r82goR1ahR2oR3jR4:4:1aoR3jR4:5:3jR5:20:1r7oR3jR4:9:2oR3jR4:1:1oR6r12R8y15:lightPixelColorR10jR11:5:2i3r13R13i-111gR14oR15R16R17i383R18i368gR19r99gar18r19r20hR14oR15R16R17i387R18i368gR19jR11:5:2i3r13goR3jR4:5:3r25oR3jR4:1:1r27R14oR15R16R17i396R18i391gR19r29goR3jR4:8:2oR3jR4:2:1r34R14oR15R16R17i431R18i399gR19jR11:13:1aoR1aoR8R23R10r41gr42hR25r41ghgaoR3jR4:8:2oR3jR4:2:1r47R14oR15R16R17i416R18i399gR19jR11:13:1aoR1aoR8R23R10r54gr55hR25r41ghgaoR3jR4:1:1r60R14oR15R16R17i416R18i399gR19r54goR3jR4:1:1r64R14oR15R16R17i430R18i421gR19r65ghR14oR15R16R17i431R18i399gR19r41goR3jR4:0:1jR28:3:1d0R14oR15R16R17i438R18i436gR19r41ghR14oR15R16R17i439R18i399gR19r41gR14oR15R16R17i439R18i391gR19r29gR14oR15R16R17i439R18i368gR19r105ghR14oR15R16R17i445R18i362gR19r82gR6jR29:1:0R30oR6r85R8y8:fragmentR10jR11:13:1aoR1ahR25r82ghR13i-114gR25r82ghR8y19:h3d.shader.DirLighty4:varsar84r60r11r151r27r64r98hg";
h3d.shader.PointLight.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:7:2oy4:kindjy12:hxsl.VarKind:4:0y4:namey4:dvecy4:typejy9:hxsl.Type:5:2i3jy12:hxsl.VecType:1:0y2:idi-124goR3jR4:5:3jy16:haxe.macro.Binop:3:0oR3jR4:1:1oR5jR6:2:0R7y13:lightPositionR9jR10:5:2i3r9R12i-121gy1:poy4:filey68:C%3A%5CUsers%5CAlix%5CDesktop%5Cheaps%5Ch3d%2Fshader%2FPointLight.hxy3:maxi358y3:mini345gy1:tr16goR3jR4:1:1oR5r8R7y19:transformedPositionR9jR10:5:2i3r9R12i-117gR15oR16R17R18i380R19i361gR20r21gR15oR16R17R18i380R19i345gR20r10gR15oR16R17R18i381R19i334gR20jR10:0:0goR3jR4:7:2oR5r8R7y5:dist2R9jR10:3:0R12i-125goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:29:0R15oR16R17R18i402R19i398gR20jR10:13:1aoR1aoR7y1:_R9r10goR7y1:bR9jR10:5:2i3r9ghy3:retr31ghgaoR3jR4:1:1r7R15oR16R17R18i402R19i398gR20r10goR3jR4:1:1r7R15oR16R17R18i411R19i407gR20r10ghR15oR16R17R18i412R19i398gR20r31gR15oR16R17R18i413R19i386gR20r28goR3jR4:7:2oR5r8R7y4:distR9r31R12i-126goR3jR4:8:2oR3jR4:2:1jR23:13:0R15oR16R17R18i434R19i429gR20jR10:13:1aoR1aoR7R24R9r31ghR26r31ghgaoR3jR4:1:1r30R15oR16R17R18i434R19i429gR20r31ghR15oR16R17R18i441R19i429gR20r31gR15oR16R17R18i442R19i418gR20r28goR3jR4:5:3jR13:20:1jR13:0:0oR3jR4:9:2oR3jR4:1:1oR5r8R7y10:lightColorR9jR10:5:2i3r9R12i-115gR15oR16R17R18i457R19i447gR20r81gajy14:hxsl.Component:0:0jR29:1:0jR29:2:0hR15oR16R17R18i461R19i447gR20jR10:5:2i3r9goR3jR4:5:3jR13:1:0oR3jR4:1:1oR5r15R7y5:colorR9jR10:5:2i3r9R12i-119gR15oR16R17R18i470R19i465gR20r95goR3jR4:3:1oR3jR4:5:3jR13:2:0oR3jR4:8:2oR3jR4:2:1jR23:22:0R15oR16R17R18i501R19i474gR20jR10:13:1aoR1aoR7R24R9r31goR7R25R9r31ghR26r31ghgaoR3jR4:8:2oR3jR4:2:1r34R15oR16R17R18i491R19i474gR20jR10:13:1aoR1aoR7R24R9jR10:5:2i3r9gr41hR26r31ghgaoR3jR4:1:1oR5r8R7y17:transformedNormalR9r121R12i-118gR15oR16R17R18i491R19i474gR20r121goR3jR4:1:1r7R15oR16R17R18i500R19i496gR20r10ghR15oR16R17R18i501R19i474gR20r31goR3jR4:0:1jy10:hxsl.Const:3:1d0R15oR16R17R18i508R19i506gR20r31ghR15oR16R17R18i509R19i474gR20r31goR3jR4:8:2oR3jR4:2:1r34R15oR16R17R18i543R19i512gR20jR10:13:1aoR1aoR7R24R9jR10:5:2i3r9gr41hR26r31ghgaoR3jR4:8:2oR3jR4:2:1jR23:38:0R15oR16R17R18i516R19i512gR20jR10:13:1ahgaoR3jR4:1:1r56R15oR16R17R18i521R19i517gR20r31goR3jR4:1:1r30R15oR16R17R18i528R19i523gR20r31goR3jR4:5:3r92oR3jR4:1:1r56R15oR16R17R18i534R19i530gR20r31goR3jR4:1:1r30R15oR16R17R18i542R19i537gR20r31gR15oR16R17R18i542R19i530gR20r31ghR15oR16R17R18i543R19i512gR20r147goR3jR4:1:1oR5r15R7y6:paramsR9jR10:5:2i3r9R12i-120gR15oR16R17R18i554R19i548gR20r177ghR15oR16R17R18i555R19i512gR20r31gR15oR16R17R18i555R19i474gR20r31gR15oR16R17R18i556R19i473gR20r31gR15oR16R17R18i556R19i465gR20r95gR15oR16R17R18i556R19i447gR20r90ghR15oR16R17R18i562R19i328gR20r28gR5jy17:hxsl.FunctionKind:0:0y3:refoR5jR6:6:0R7y6:vertexR9jR10:13:1aoR1ahR26r28ghR12i-122gR26r28goR1ahR2oR3jR4:4:1aoR3jR4:7:2oR5r8R7R8R9jR10:5:2i3r9R12i-127goR3jR4:5:3r12oR3jR4:1:1r14R15oR16R17R18i618R19i605gR20r16goR3jR4:1:1r20R15oR16R17R18i640R19i621gR20r21gR15oR16R17R18i640R19i605gR20r205gR15oR16R17R18i641R19i594gR20r28goR3jR4:7:2oR5r8R7R22R9r31R12i-128goR3jR4:8:2oR3jR4:2:1r34R15oR16R17R18i662R19i658gR20jR10:13:1aoR1aoR7R24R9r205gr41hR26r31ghgaoR3jR4:1:1r204R15oR16R17R18i662R19i658gR20r205goR3jR4:1:1r204R15oR16R17R18i671R19i667gR20r205ghR15oR16R17R18i672R19i658gR20r31gR15oR16R17R18i673R19i646gR20r28goR3jR4:7:2oR5r8R7R27R9r31R12i-129goR3jR4:8:2oR3jR4:2:1r59R15oR16R17R18i694R19i689gR20jR10:13:1aoR1aoR7R24R9r31ghR26r31ghgaoR3jR4:1:1r218R15oR16R17R18i694R19i689gR20r31ghR15oR16R17R18i701R19i689gR20r31gR15oR16R17R18i702R19i678gR20r28goR3jR4:5:3jR13:20:1r76oR3jR4:9:2oR3jR4:1:1oR5r8R7y15:lightPixelColorR9jR10:5:2i3r9R12i-116gR15oR16R17R18i722R19i707gR20r263gar85r86r87hR15oR16R17R18i726R19i707gR20jR10:5:2i3r9goR3jR4:5:3r92oR3jR4:1:1r94R15oR16R17R18i735R19i730gR20r95goR3jR4:3:1oR3jR4:5:3r100oR3jR4:8:2oR3jR4:2:1r103R15oR16R17R18i766R19i739gR20jR10:13:1aoR1aoR7R24R9r31gr110hR26r31ghgaoR3jR4:8:2oR3jR4:2:1r34R15oR16R17R18i756R19i739gR20jR10:13:1aoR1aoR7R24R9r121gr41hR26r31ghgaoR3jR4:1:1r125R15oR16R17R18i756R19i739gR20r121goR3jR4:1:1r204R15oR16R17R18i765R19i761gR20r205ghR15oR16R17R18i766R19i739gR20r31goR3jR4:0:1jR32:3:1d0R15oR16R17R18i773R19i771gR20r31ghR15oR16R17R18i774R19i739gR20r31goR3jR4:8:2oR3jR4:2:1r34R15oR16R17R18i808R19i777gR20jR10:13:1aoR1aoR7R24R9jR10:5:2i3r9gr41hR26r31ghgaoR3jR4:8:2oR3jR4:2:1r152R15oR16R17R18i781R19i777gR20r156gaoR3jR4:1:1r240R15oR16R17R18i786R19i782gR20r31goR3jR4:1:1r218R15oR16R17R18i793R19i788gR20r31goR3jR4:5:3r92oR3jR4:1:1r240R15oR16R17R18i799R19i795gR20r31goR3jR4:1:1r218R15oR16R17R18i807R19i802gR20r31gR15oR16R17R18i807R19i795gR20r31ghR15oR16R17R18i808R19i777gR20r318goR3jR4:1:1r176R15oR16R17R18i819R19i813gR20r177ghR15oR16R17R18i820R19i777gR20r31gR15oR16R17R18i820R19i739gR20r31gR15oR16R17R18i821R19i738gR20r31gR15oR16R17R18i821R19i730gR20r95gR15oR16R17R18i821R19i707gR20r269ghR15oR16R17R18i827R19i588gR20r28gR5jR34:1:0R35oR5r194R7y8:fragmentR9jR10:13:1aoR1ahR26r28ghR12i-123gR26r28ghR7y21:h3d.shader.PointLighty4:varsar193r125r80r14r359r20r94r262r176hg";
h3d.shader.Skin.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey19:transformedPositiony4:typejy9:hxsl.Type:5:2i3jy12:hxsl.VecType:1:0y2:idi-56gy1:poy4:filey62:C%3A%5CUsers%5CAlix%5CDesktop%5Cheaps%5Ch3d%2Fshader%2FSkin.hxy3:maxi413y3:mini394gy1:tr12goR3jR4:5:3jR5:0:0oR3jR4:5:3r16oR3jR4:5:3jR5:1:0oR3jR4:3:1oR3jR4:5:3r19oR3jR4:1:1oR6jR7:1:0R8y8:positionR10jR11:5:2i3r11y6:parentoR6r24R8y5:inputR10jR11:12:1ar23oR6r24R8y6:normalR10jR11:5:2i3r11R21r26R13i-53goR6r24R8y7:weightsR10jR11:5:2i3r11R21r26R13i-54goR6r24R8y7:indexesR10jR11:9:1i4R21r26R13i-55ghR13i-51gR13i-52gR14oR15R16R17i436R18i422gR19r25goR3jR4:16:2oR3jR4:1:1oR6jR7:2:0R8y13:bonesMatrixesR10jR11:14:2jR11:8:0jy13:hxsl.SizeDecl:1:1oR6r40R8y8:MaxBonesR10jR11:1:0y10:qualifiersajy17:hxsl.VarQualifier:0:1nhR13i-58gR13i-59gR14oR15R16R17i452R18i439gR19r47goR3jR4:9:2oR3jR4:1:1r32R14oR15R16R17i466R18i453gR19r33gajy14:hxsl.Component:0:0hR14oR15R16R17i468R18i453gR19r43gR14oR15R16R17i469R18i439gR19r41gR14oR15R16R17i469R18i422gR19jR11:5:2i3r11gR14oR15R16R17i470R18i421gR19r62goR3jR4:9:2oR3jR4:1:1r30R14oR15R16R17i486R18i473gR19r31gar55hR14oR15R16R17i488R18i473gR19jR11:3:0gR14oR15R16R17i488R18i421gR19r62goR3jR4:5:3r19oR3jR4:3:1oR3jR4:5:3r19oR3jR4:1:1r23R14oR15R16R17i511R18i497gR19r25goR3jR4:16:2oR3jR4:1:1r39R14oR15R16R17i527R18i514gR19r47goR3jR4:9:2oR3jR4:1:1r32R14oR15R16R17i541R18i528gR19r33gajR31:1:0hR14oR15R16R17i543R18i528gR19r43gR14oR15R16R17i544R18i514gR19r41gR14oR15R16R17i544R18i497gR19r62gR14oR15R16R17i545R18i496gR19r62goR3jR4:9:2oR3jR4:1:1r30R14oR15R16R17i561R18i548gR19r31gar90hR14oR15R16R17i563R18i548gR19r72gR14oR15R16R17i563R18i496gR19r62gR14oR15R16R17i563R18i421gR19jR11:5:2i3r11goR3jR4:5:3r19oR3jR4:3:1oR3jR4:5:3r19oR3jR4:1:1r23R14oR15R16R17i586R18i572gR19r25goR3jR4:16:2oR3jR4:1:1r39R14oR15R16R17i602R18i589gR19r47goR3jR4:9:2oR3jR4:1:1r32R14oR15R16R17i616R18i603gR19r33gajR31:2:0hR14oR15R16R17i618R18i603gR19r43gR14oR15R16R17i619R18i589gR19r41gR14oR15R16R17i619R18i572gR19r62gR14oR15R16R17i620R18i571gR19r62goR3jR4:9:2oR3jR4:1:1r30R14oR15R16R17i636R18i623gR19r31gar126hR14oR15R16R17i638R18i623gR19r72gR14oR15R16R17i638R18i571gR19r62gR14oR15R16R17i638R18i421gR19jR11:5:2i3r11gR14oR15R16R17i638R18i394gR19r12ghR14oR15R16R17i644R18i388gR19jR11:0:0gR6jy17:hxsl.FunctionKind:0:0y3:refoR6jR7:6:0R8y6:vertexR10jR11:13:1aoR1ahy3:retr151ghR13i-60gR35r151ghR8y15:h3d.shader.Skiny4:varsar153oR6r10R8y17:transformedNormalR10jR11:5:2i3r11R13i-57gr39r26r9r42hg";
h3d.shader.Texture.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey12:calculatedUVy4:typejy9:hxsl.Type:5:2i2jy12:hxsl.VecType:1:0y2:idi-17gy1:poy4:filey65:C%3A%5CUsers%5CAlix%5CDesktop%5Cheaps%5Ch3d%2Fshader%2FTexture.hxy3:maxi370y3:mini358gy1:tr12goR3jR4:1:1oR6jR7:1:0R8y2:uvR10jR11:5:2i2r11y6:parentoR6r17R8y5:inputR10jR11:12:1ar16hR13i-11gR13i-12gR14oR15R16R17i381R18i373gR19r18gR14oR15R16R17i381R18i358gR19r12ghR14oR15R16R17i387R18i352gR19jR11:0:0gR6jy17:hxsl.FunctionKind:0:0y3:refoR6jR7:6:0R8y6:vertexR10jR11:13:1aoR1ahy3:retr28ghR13i-19gR26r28goR1ahR2oR3jR4:4:1aoR3jR4:7:2oR6r10R8y1:cR10jR11:5:2i4r11R13i-21goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:32:0R14oR15R16R17i434R18i427gR19jR11:13:1aoR1aoR8y1:_R10jR11:10:0goR8y1:bR10jR11:5:2i2r11ghR26r42ghgaoR3jR4:1:1oR6jR7:2:0R8y7:textureR10r52R13i-16gR14oR15R16R17i434R18i427gR19r52goR3jR4:1:1r9R14oR15R16R17i451R18i439gR19r12ghR14oR15R16R17i452R18i427gR19r42gR14oR15R16R17i453R18i419gR19r28goR3jR4:10:3oR3jR4:5:3jR5:14:0oR3jR4:1:1oR6r59R8y9:killAlphaR10jR11:2:0y10:qualifiersajy17:hxsl.VarQualifier:0:1nhR13i-14gR14oR15R16R17i471R18i462gR19r74goR3jR4:5:3jR5:9:0oR3jR4:5:3jR5:3:0oR3jR4:9:2oR3jR4:1:1r41R14oR15R16R17i476R18i475gR19r42gajy14:hxsl.Component:3:0hR14oR15R16R17i478R18i475gR19jR11:3:0goR3jR4:1:1oR6r59R8y18:killAlphaThresholdR10r91R13i-15gR14oR15R16R17i499R18i481gR19r91gR14oR15R16R17i499R18i475gR19r91goR3jR4:0:1jy10:hxsl.Const:3:1zR14oR15R16R17i503R18i502gR19r91gR14oR15R16R17i503R18i475gR19r74gR14oR15R16R17i503R18i462gR19r74goR3jR4:11:0R14oR15R16R17i513R18i506gR19r28gnR14oR15R16R17i513R18i458gR19r28goR3jR4:10:3oR3jR4:1:1oR6r59R8y8:additiveR10r74R33ajR34:0:1nhR13i-13gR14oR15R16R17i531R18i523gR19r74goR3jR4:5:3jR5:20:1jR5:0:0oR3jR4:1:1oR6r10R8y10:pixelColorR10jR11:5:2i4r11R13i-18gR14oR15R16R17i549R18i539gR19r123goR3jR4:1:1r41R14oR15R16R17i554R18i553gR19r42gR14oR15R16R17i554R18i539gR19r123goR3jR4:5:3jR5:20:1jR5:1:0oR3jR4:1:1r122R14oR15R16R17i580R18i570gR19r123goR3jR4:1:1r41R14oR15R16R17i585R18i584gR19r42gR14oR15R16R17i585R18i570gR19r123gR14oR15R16R17i585R18i519gR19r28ghR14oR15R16R17i591R18i413gR19r28gR6jR23:1:0R24oR6r31R8y8:fragmentR10jR11:13:1aoR1ahR26r28ghR13i-20gR26r28ghR8y18:h3d.shader.Texturey4:varsar9r30r147r113r58r93r19r73r122hg";
h3d.shader.Texture2.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey13:calculatedUV2y4:typejy9:hxsl.Type:5:2i2jy12:hxsl.VecType:1:0y2:idi-165gy1:poy4:filey66:C%3A%5CUsers%5CAlix%5CDesktop%5Cheaps%5Ch3d%2Fshader%2FTexture2.hxy3:maxi448y3:mini435gy1:tr12goR3jR4:1:1oR6jR7:1:0R8y3:uv2R10jR11:5:2i2r11y6:parentoR6r17R8y5:inputR10jR11:12:1ar16hR13i-159gR13i-160gR14oR15R16R17i460R18i451gR19r18gR14oR15R16R17i460R18i435gR19r12ghR14oR15R16R17i466R18i429gR19jR11:0:0gR6jy17:hxsl.FunctionKind:0:0y3:refoR6jR7:6:0R8y6:vertexR10jR11:13:1aoR1ahy3:retr28ghR13i-167gR26r28goR1ahR2oR3jR4:4:1aoR3jR4:7:2oR6r10R8y1:cR10jR11:5:2i4r11R13i-169goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:32:0R14oR15R16R17i513R18i506gR19jR11:13:1aoR1aoR8y1:_R10jR11:10:0goR8y1:bR10jR11:5:2i2r11ghR26r42ghgaoR3jR4:1:1oR6jR7:2:0R8y7:textureR10r52R13i-164gR14oR15R16R17i513R18i506gR19r52goR3jR4:1:1r9R14oR15R16R17i531R18i518gR19r12ghR14oR15R16R17i532R18i506gR19r42gR14oR15R16R17i533R18i498gR19r28goR3jR4:10:3oR3jR4:5:3jR5:14:0oR3jR4:1:1oR6r59R8y9:killAlphaR10jR11:2:0y10:qualifiersajy17:hxsl.VarQualifier:0:1nhR13i-162gR14oR15R16R17i551R18i542gR19r74goR3jR4:5:3jR5:9:0oR3jR4:5:3jR5:3:0oR3jR4:9:2oR3jR4:1:1r41R14oR15R16R17i556R18i555gR19r42gajy14:hxsl.Component:3:0hR14oR15R16R17i558R18i555gR19jR11:3:0goR3jR4:1:1oR6r59R8y18:killAlphaThresholdR10r91R13i-163gR14oR15R16R17i579R18i561gR19r91gR14oR15R16R17i579R18i555gR19r91goR3jR4:0:1jy10:hxsl.Const:3:1zR14oR15R16R17i583R18i582gR19r91gR14oR15R16R17i583R18i555gR19r74gR14oR15R16R17i583R18i542gR19r74goR3jR4:11:0R14oR15R16R17i593R18i586gR19r28gnR14oR15R16R17i593R18i538gR19r28goR3jR4:10:3oR3jR4:1:1oR6r59R8y8:additiveR10r74R33ajR34:0:1nhR13i-161gR14oR15R16R17i611R18i603gR19r74goR3jR4:5:3jR5:20:1jR5:0:0oR3jR4:1:1oR6r10R8y10:pixelColorR10jR11:5:2i4r11R13i-166gR14oR15R16R17i629R18i619gR19r123goR3jR4:1:1r41R14oR15R16R17i634R18i633gR19r42gR14oR15R16R17i634R18i619gR19r123goR3jR4:5:3jR5:20:1jR5:1:0oR3jR4:1:1r122R14oR15R16R17i660R18i650gR19r123goR3jR4:1:1r41R14oR15R16R17i665R18i664gR19r42gR14oR15R16R17i665R18i650gR19r123gR14oR15R16R17i665R18i599gR19r28ghR14oR15R16R17i671R18i492gR19r28gR6jR23:1:0R24oR6r31R8y8:fragmentR10jR11:13:1aoR1ahR26r28ghR13i-168gR26r28ghR8y19:h3d.shader.Texture2y4:varsar30r9r147r113r58r93r19r73r122hg";
h3d.shader.UVScroll.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:20:1jR5:0:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey12:calculatedUVy4:typejy9:hxsl.Type:5:2i2jy12:hxsl.VecType:1:0y2:idi-171gy1:poy4:filey66:C%3A%5CUsers%5CAlix%5CDesktop%5Cheaps%5Ch3d%2Fshader%2FUVScroll.hxy3:maxi180y3:mini168gy1:tr13goR3jR4:1:1oR6jR7:2:0R8y7:uvDeltaR10jR11:5:2i2r12R13i-170gR14oR15R16R17i191R18i184gR19r19gR14oR15R16R17i191R18i168gR19r13ghR14oR15R16R17i197R18i162gR19jR11:0:0gR6jy17:hxsl.FunctionKind:0:0y3:refoR6jR7:6:0R8y6:vertexR10jR11:13:1aoR1ahy3:retr26ghR13i-172gR24r26ghR8y19:h3d.shader.UVScrolly4:varsar10r28r17hg";
h3d.shader.VertexColor.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:10:3oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:2:0y4:namey8:additivey4:typejy9:hxsl.Type:2:0y10:qualifiersajy17:hxsl.VarQualifier:0:1nhy2:idi-176gy1:poy4:filey69:C%3A%5CUsers%5CAlix%5CDesktop%5Cheaps%5Ch3d%2Fshader%2FVertexColor.hxy3:maxi240y3:mini232gy1:tr10goR3jR4:5:3jy16:haxe.macro.Binop:20:1jR20:0:0oR3jR4:9:2oR3jR4:1:1oR5jR6:4:0R7y10:pixelColorR9jR10:5:2i4jy12:hxsl.VecType:1:0R13i-175gR14oR15R16R17i258R18i248gR19r23gajy14:hxsl.Component:0:0jR23:1:0jR23:2:0hR14oR15R16R17i262R18i248gR19jR10:5:2i3r22goR3jR4:1:1oR5jR6:1:0R7y5:colorR9jR10:5:2i3r22y6:parentoR5r35R7y5:inputR9jR10:12:1ar34hR13i-173gR13i-174gR14oR15R16R17i277R18i266gR19r36gR14oR15R16R17i277R18i248gR19r32goR3jR4:5:3jR20:20:1jR20:1:0oR3jR4:9:2oR3jR4:1:1r20R14oR15R16R17i303R18i293gR19r23gar27r28r29hR14oR15R16R17i307R18i293gR19jR10:5:2i3r22goR3jR4:1:1r34R14oR15R16R17i322R18i311gR19r36gR14oR15R16R17i322R18i293gR19r54gR14oR15R16R17i322R18i228gR19jR10:0:0ghR14oR15R16R17i328R18i222gR19r62gR5jy17:hxsl.FunctionKind:1:0y3:refoR5jR6:6:0R7y8:fragmentR9jR10:13:1aoR1ahy3:retr62ghR13i-177gR30r62ghR7y22:h3d.shader.VertexColory4:varsar66r8r37r20hg";
h3d.shader.VertexColorAlpha.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:10:3oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:2:0y4:namey8:additivey4:typejy9:hxsl.Type:2:0y10:qualifiersajy17:hxsl.VarQualifier:0:1nhy2:idi-181gy1:poy4:filey74:C%3A%5CUsers%5CAlix%5CDesktop%5Cheaps%5Ch3d%2Fshader%2FVertexColorAlpha.hxy3:maxi245y3:mini237gy1:tr10goR3jR4:5:3jy16:haxe.macro.Binop:20:1jR20:0:0oR3jR4:1:1oR5jR6:4:0R7y10:pixelColorR9jR10:5:2i4jy12:hxsl.VecType:1:0R13i-180gR14oR15R16R17i263R18i253gR19r22goR3jR4:1:1oR5jR6:1:0R7y5:colorR9jR10:5:2i4r21y6:parentoR5r27R7y5:inputR9jR10:12:1ar26hR13i-178gR13i-179gR14oR15R16R17i278R18i267gR19r28gR14oR15R16R17i278R18i253gR19r22goR3jR4:5:3jR20:20:1jR20:1:0oR3jR4:1:1r19R14oR15R16R17i304R18i294gR19r22goR3jR4:1:1r26R14oR15R16R17i319R18i308gR19r28gR14oR15R16R17i319R18i294gR19r22gR14oR15R16R17i319R18i233gR19jR10:0:0ghR14oR15R16R17i325R18i227gR19r49gR5jy17:hxsl.FunctionKind:1:0y3:refoR5jR6:6:0R7y8:fragmentR9jR10:13:1aoR1ahy3:retr49ghR13i-182gR29r49ghR7y27:h3d.shader.VertexColorAlphay4:varsar53r8r29r19hg";
haxe.crypto.Base64.CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
haxe.crypto.Base64.BYTES = haxe.io.Bytes.ofString(haxe.crypto.Base64.CHARS);
haxe.ds.ObjectMap.count = 0;
haxe.io.Output.LN2 = Math.log(2);
haxe.xml.Parser.escapes = (function($this) {
	var $r;
	var h = new haxe.ds.StringMap();
	h.set("lt","<");
	h.set("gt",">");
	h.set("amp","&");
	h.set("quot","\"");
	h.set("apos","'");
	h.set("nbsp",String.fromCharCode(160));
	$r = h;
	return $r;
}(this));
hxd.Key.initDone = false;
hxd.Key.keyPressed = [];
hxd.System.LOOP_INIT = false;
hxd.System.setCursor = hxd.System.setNativeCursor;
hxd.Timer.wantedFPS = 60;
hxd.Timer.maxDeltaTime = 0.5;
hxd.Timer.oldTime = haxe.Timer.stamp();
hxd.Timer.tmod_factor = 0.95;
hxd.Timer.calc_tmod = 1;
hxd.Timer.tmod = 1;
hxd.Timer.deltaT = 1;
hxd.Timer.frameCount = 0;
hxd.impl.Memory.stack = new Array();
hxd.impl.Memory.inst = new hxd.impl.MemoryReader();
hxd.impl.Tmp.bytes = new Array();
hxd.res.EmbedFileSystem.invalidChars = new EReg("[^A-Za-z0-9_]","g");
hxd.res.FbxModel.isLeftHanded = true;
hxd.res.Image.ALLOW_NPOT = false;
hxd.res.Image.DEFAULT_FILTER = h3d.mat.Filter.Linear;
hxsl.GlslOut.KWD_LIST = ["input","output","discard","dvec2","dvec3","dvec4"];
hxsl.GlslOut.KWDS = (function($this) {
	var $r;
	var _g = new haxe.ds.StringMap();
	{
		var _g1 = 0;
		var _g2 = hxsl.GlslOut.KWD_LIST;
		while(_g1 < _g2.length) {
			var k = _g2[_g1];
			++_g1;
			_g.set(k,true);
		}
	}
	$r = _g;
	return $r;
}(this));
hxsl.GlslOut.GLOBALS = (function($this) {
	var $r;
	var m = new haxe.ds.EnumValueMap();
	{
		var _g = 0;
		var _g1 = Type.allEnums(hxsl.TGlobal);
		while(_g < _g1.length) {
			var g = _g1[_g];
			++_g;
			var n = "" + Std.string(g);
			n = n.charAt(0).toLowerCase() + HxOverrides.substr(n,1,null);
			m.set(g,n);
		}
	}
	m.set(hxsl.TGlobal.ToInt,"int");
	m.set(hxsl.TGlobal.ToFloat,"float");
	m.set(hxsl.TGlobal.ToBool,"bool");
	var $it0 = m.iterator();
	while( $it0.hasNext() ) {
		var g1 = $it0.next();
		hxsl.GlslOut.KWDS.set(g1,true);
	}
	$r = m;
	return $r;
}(this));
hxsl.GlslOut.MAT34 = "struct mat3x4 { vec4 a; vec4 b; vec4 c; };";
hxsl.RuntimeShader.UID = 0;
motion.actuators.SimpleActuator.actuators = new Array();
motion.actuators.SimpleActuator.actuatorsLength = 0;
motion.actuators.SimpleActuator.addedEvent = false;
motion.Actuate.defaultActuator = motion.actuators.SimpleActuator;
motion.Actuate.defaultEase = motion.easing.Expo.get_easeOut();
motion.Actuate.targetLibraries = new haxe.ds.ObjectMap();
Main.main();
})();