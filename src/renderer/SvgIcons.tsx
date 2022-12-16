import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

export function AcumaticaIcon(props: SvgIconProps) {
	return (
		<SvgIcon {...props} viewBox='0 0 35 35'>
			<path d='M24.0648649,24.089616 L17.2948949,24.089616 C13.5553153,24.089616 10.5249249,21.068976 10.5249249,17.344656 C10.5249249,13.617936 13.5553153,10.595376 17.2948949,10.595376 C21.0344745,10.595376 24.0648649,13.617936 24.0648649,17.344656 L24.0648649,24.089616 Z M17.2948949,0.282576 C7.8375976,0.282576 0.172972973,7.921776 0.172972973,17.344656 C0.172972973,26.768496 7.8375976,34.405776 17.2948949,34.405776 L34.4168168,34.405776 L34.4168168,17.344656 C34.4168168,7.921776 26.7497898,0.282576 17.2948949,0.282576 L17.2948949,0.282576 Z' />
		</SvgIcon>
	);
}

export function WindowsExplorerIcon(props: SvgIconProps) {
	return (
		<SvgIcon {...props} viewBox='0 0 200 175'>
			<defs>
				<linearGradient id='linear-gradient' x1='19.12' y1='17.31' x2='185.84' y2='184.03' gradientUnits='userSpaceOnUse'>
					<stop offset='0' stop-color='#ffd65e' />
					<stop offset='1' stop-color='#f8b90d' />
				</linearGradient>
				<linearGradient id='linear-gradient-2' x1='56.08' y1='197.58' x2='142.92' y2='110.74' gradientUnits='userSpaceOnUse'>
					<stop offset='0' stop-color='#1290dc' />
					<stop offset='1' stop-color='#0362b6' />
				</linearGradient>
			</defs>
			<g id='Layer_2' data-name='Layer 2'>
				<g id='Layer_1-2' data-name='Layer 1'>
					<g>
						<path
							fill='url(#linear-gradient)'
							d='M200,29.88V166.25a8.75,8.75,0,0,1-8.75,8.75H8.75A8.75,8.75,0,0,1,0,166.25V40.63A10.12,10.12,0,0,1,10.12,30.5H68.25l12-8.75H191.88A8.13,8.13,0,0,1,200,29.88Z'
						/>
						<path
							fill='#e19f01'
							d='M191.88,19H81.42L70.64,5.86A16,16,0,0,0,58.25,0H10.12A10.12,10.12,0,0,0,0,10.12V40.63A10.12,10.12,0,0,1,10.12,30.5H68.25l12-8.75H191.88A8.13,8.13,0,0,1,200,29.88V27.12A8.13,8.13,0,0,0,191.88,19Z'
						/>
						<g>
							<path fill='url(#linear-gradient-2)' d='M60.5,117.5h78a27,27,0,0,1,27,27V175a0,0,0,0,1,0,0H33.5a0,0,0,0,1,0,0V144.5A27,27,0,0,1,60.5,117.5Z' />
							<path fill='#114b8a' d='M139.5,150h-80a3.5,3.5,0,0,1,0-7h80a3.5,3.5,0,0,1,0,7Z' />
						</g>
					</g>
				</g>
			</g>
		</SvgIcon>
	);
}
