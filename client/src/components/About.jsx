import React from "react";
import Styles from "../styles/About.module.css"
import reactLogo from "../assets/react.png"
import javaLogo from "../assets/java.png"
import postgresqlLogo from "../assets/postgresql.png"
import springbootLogo from "../assets/springboot.png"
import openstreetmapLogo from "../assets/openstreetmap.png"

const About = () => {
    return (
        <div className={Styles.container}>
            <div className={Styles.description}>
                <div className={Styles.descriptionTitle}> About GeoMap </div>
                <div className={Styles.descriptionText}>
                    Welcome to GeoMap, an innovative platform crafted to make managing, visualizing, and interacting with geographic data straightforward and efficient.
                    Designed with both developers and users in mind, GeoMap transforms complex spatial data into actionable insights, offering a seamless experience for anyone looking to explore or leverage the power of location-based information.
                    <br/> <br/>
                    GeoMap integrates advanced mapping technologies such as OpenStreetMap and RESTful APIs to provide accurate location tracking, real-time visualization, and interactive maps tailored to your needs.
                    Whether you're working on a project that requires precise geolocation, developing location-based services, or simply exploring spatial data, GeoMap is here to simplify the process.
                    <br/> <br/>
                    Our platform is built to bridge the gap between raw geographic data and intuitive usability.
                    From mapping user locations to visualizing global datasets, GeoMap empowers you to interact with the world's geography in dynamic and engaging ways.
                    With features like clickable map interactions and seamless data retrieval, you can build custom experiences that bring geographic insights to life.
                    <br/> <br/>
                    At GeoMap, we believe that maps are more than just tools for navigation—they are gateways to better understanding and smarter decision-making.
                    By combining powerful functionality with a user-friendly interface, we ensure that anyone, regardless of their technical background, can harness the power of geography.
                    <br/> <br/>
                    Explore the endless possibilities with GeoMap, and see how it can revolutionize the way you interact with spatial data.
                    Join us in shaping a world where geography meets innovation.
                </div>
            </div>
            <div className={Styles.technologies}>
                <div className={Styles.technologiesLabel}> Powered by: </div>
                <div className={Styles.iconsBox}>
                    <a className={Styles.technologiesLink} href="https://www.java.com">
                        <img className={Styles.icon} src={javaLogo} alt="java"/>
                    </a>
                    <a className={Styles.technologiesLink} href="https://spring.io/projects/spring-boot">
                        <img className={Styles.icon} src={springbootLogo} alt="springboot"/>
                    </a>
                    <a className={Styles.technologiesLink} href="https://www.postgresql.org">
                        <img className={Styles.icon} src={postgresqlLogo} alt="postgresql"/>
                    </a>
                    <a className={Styles.technologiesLink} href="https://react.dev">
                        <img className={Styles.icon} src={reactLogo} alt="react"/>
                    </a>
                    <a className={Styles.technologiesLink} href="https://www.openstreetmap.org">
                        <img className={Styles.icon} src={openstreetmapLogo} alt="openstreetmap"/>
                    </a>
                </div>
            </div>
        </div>
    )
};

export default About;
