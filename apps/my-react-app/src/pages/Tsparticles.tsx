import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

function Tsparticles() {
	const [init, setInit] = useState(false);

	useEffect(() => {
		initParticlesEngine(async (engine) => {
			await loadSlim(engine);
		}).then(() => {
			setInit(true);
		});
	}, []);

	// 使用 useMemo 缓存粒子配置，避免重复创建
	const particlesConfig = useMemo(
		() => ({
			style: {
				position: 'absolute',
				width: '100%',
				height: '100%'
			},
			background: {
				color: {
					value: '#0a0e27'
				}
			},
			fullScreen: {
				enable: true,
				zIndex: 0
			},
			particles: {
				number: {
					value: 150,
					density: {
						enable: true,
						area: 800
					}
				},
				color: {
					value: ['#00d4ff', '#0099ff', '#00ff88', '#ff00ff', '#00ffff']
				},
				shape: {
					type: ['circle', 'square']
				},
				opacity: {
					value: {
						min: 0.3,
						max: 0.8
					},
					animation: {
						enable: true,
						speed: 1,
						minimumValue: 0.1
					}
				},
				size: {
					value: {
						min: 1,
						max: 4
					},
					animation: {
						enable: true,
						speed: 3,
						minimumValue: 0.5
					}
				},
				move: {
					enable: true,
					speed: {
						min: 0.5,
						max: 2
					},
					direction: 'bottom' as const,
					random: true,
					straight: false,
					outModes: 'out' as const,
					bounce: false,
					acceleration: {
						enable: true,
						x: 0.3,
						y: 0.3
					}
				},
				links: {
					enable: true,
					distance: 150,
					color: {
						value: '#00ccff'
					},
					opacity: {
						value: 0.4,
						animation: {
							enable: true,
							speed: 1,
							minimumValue: 0.1
						}
					},
					width: 1.5
				},
				repulse: {
					random: {
						enable: true
					},
					value: 0,
					enabled: false
				},
				attract: {
					random: {
						enable: false
					},
					value: 0,
					enabled: false
				},
				rotate: {
					value: {
						min: 0,
						max: 360
					},
					direction: 'random',
					move: true,
					animation: {
						enable: true,
						speed: 5
					}
				}
			},
			interactivity: {
				events: {
					onHover: {
						enable: true,
						mode: ['grab', 'bubble']
					},
					onClick: {
						enable: true,
						mode: 'repulse'
					},
					resize: {
						enable: true
					}
				},
				modes: {
					grab: {
						distance: 200,
						line_linked: {
							opacity: 0.8
						},
						speed: 2
					},
					bubble: {
						distance: 150,
						size: 8,
						duration: 0.3,
						opacity: 1
					},
					repulse: {
						distance: 300,
						duration: 0.8,
						speed: 5
					}
				}
			}
		}),
		[]
	);

	return ReactDOM.createPortal(
		<div
			style={{
				position: 'relative',
				width: '100%',
				height: '100%',
				overflow: 'hidden'
			}}>
			{init && <Particles id="tsparticles" options={particlesConfig} />}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					zIndex: 1,
					textAlign: 'center',
					color: 'white',
					textShadow: '0 0 20px rgba(0, 255, 255, 0.8)'
				}}>
				<h1
					style={{
						fontSize: '4rem',
						margin: '0 0 20px 0',
						fontWeight: 'bold'
					}}>
					欢迎来到
				</h1>

				<p style={{ fontSize: '1.2rem', margin: '0 0 40px 0', opacity: 0.8 }}>
					享受动态的粒子效果 • 鼠标悬停和点击体验交互
				</p>
				<Link
					to="/home"
					style={{
						display: 'inline-block',
						padding: '12px 40px',
						fontSize: '18px',
						color: '#000',
						backgroundColor: '#00ffff',
						textDecoration: 'none',
						borderRadius: '8px',
						border: '2px solid #00ffff',
						transition: 'all 0.3s ease',
						cursor: 'pointer',
						fontWeight: 'bold',
						boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)'
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.backgroundColor = '#0099ff';
						e.currentTarget.style.borderColor = '#0099ff';
						e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 153, 255, 0.8)';
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.backgroundColor = '#00ffff';
						e.currentTarget.style.borderColor = '#00ffff';
						e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
					}}>
					前往首页
				</Link>
			</div>
		</div>,
		document.querySelector('#subapp-container')! ?? document.body
	);
}

export default Tsparticles;
