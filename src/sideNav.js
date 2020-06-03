import React, { Component } from 'react';
import './App.css'

/* DATA ITEMS
	listOfItems: array type. Contains name of elements to access,
	elementWidth: container width,
	circleRadius: radius of button circles,
	circleGap: spacing between circles,
	callBackFunction: callback on click of button
	itemClicked: currently selected item
*/


class SideNav extends Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	componentWillMount() {
		document.addEventListener('wheel', (event) => { })
	}

	componentDidMount() {
		debugger;
		let itemList = document.getElementsByTagName('circle');
		itemList[this.props.itemClicked].classList.add('buttonSelectedColor');
	}

	componentDidUpdate() {
		let itemList = document.getElementsByTagName('circle');
		Array.from(itemList).forEach((item) => {
			item.classList.add('buttonNotSelectedColor');
			item.classList.remove('buttonSelectedColor');
		})
		itemList[this.props.itemClicked].classList.remove('buttonNotSelectedColor');
		itemList[this.props.itemClicked].classList.add('buttonSelectedColor');
	}



	render() {
		return (
			< div >
				<svg
					width={`${this.props.circleRadius * 2 + 10}px`}
					height={`${this.props.listOfItems.length * (2 * (this.props.circleRadius) + this.props.circleGap)}px`}>
					{
						this.props.listOfItems.map((element, index) => {
							return <circle fill={'grey'}
								key={index}
								data-id={index}
								cx={`50%`}
								cy={`${(2 * (this.props.circleRadius) + this.props.circleGap) * (index) + this.props.circleRadius}px`}
								r={this.props.circleRadius}
								onClick={(event) => {
									// this.setState({ itemClicked: index });
									this.props.callBackFunction(event, index);
								}
								}></circle>
						})
					}
				</svg>
			</div >
		)
	}
} export default SideNav;