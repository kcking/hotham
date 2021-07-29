use std::{cell::RefCell, collections::HashMap, rc::Rc};

use cgmath::{vec3, Euler, Quaternion, Rad};
use hotham::{node::Node, HothamError, HothamResult as Result, Program};

#[derive(Debug, Clone)]
pub struct Asteroid {}

impl Asteroid {
    pub fn new() -> Self {
        Self {}
    }
}

impl Program for Asteroid {
    // TODO: Make more ergonomic
    fn init(&mut self, nodes: HashMap<String, Rc<RefCell<Node>>>) -> Result<Vec<Node>> {
        // let asteroid = nodes
        //     .get("Asteroid")
        //     .ok_or(HothamError::EmptyListError)?
        //     .clone();

        // let mut asteroid = Node::clone(&asteroid.borrow());
        // let translation = vec3(0.0, 1.0, 0.0);
        // let rotation = vec3(0.0, 0.0, 0.0);
        // let scale = vec3(0.1, 0.1, 0.1);
        // asteroid.scale = scale;
        // let rotation = Euler::new(Rad(rotation.x), Rad(rotation.y), Rad(rotation.z));
        // asteroid.rotation = Quaternion::from(rotation);
        // asteroid.translation = translation;

        // let refinery = nodes
        //     .get("Refinery")
        //     .ok_or(HothamError::EmptyListError)?
        //     .clone();
        // let refinery = Node::clone(&refinery.borrow());

        // Ok(vec![asteroid, refinery])
        // let hand = nodes
        //     .get("Hand")
        //     .ok_or(HothamError::EmptyListError)?
        //     .clone();
        // let mut hand = Node::clone(&hand.borrow());
        // hand.active_animation_index.replace(0);

        let test = nodes.get("Test").unwrap().borrow();
        let mut test = Node::clone(&test);
        test.translation = vec3(0.0, 1.0, -2.0);
        test.scale = vec3(3.0, 3.0, 3.0);
        test.active_animation_index.replace(0);

        Ok(vec![test])
    }

    fn get_gltf_data(&self) -> (&[u8], &[u8]) {
        // (
        //     include_bytes!("../assets/asteroid.gltf"),
        //     include_bytes!("../assets/asteroid_data.bin"),
        // )
        (
            include_bytes!("../assets/animation_test.gltf"),
            include_bytes!("../assets/animation_test_data.bin"),
        )
    }
}
