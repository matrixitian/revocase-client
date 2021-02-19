<template>
	<transition name="fade">
		<div id="unclickable">
			<div id="main">
				<span class="material-icons mailIcon">
					password
				</span>
				<h1>Password Reset</h1>
				<p>Please enter the new password you want!</p>
				<input id="inputCode" 
				placeholder="New password" type="text"
				ref="code"
				v-model="newPassword">
				<div id="actionButtons">
					<button id="verifyBtn"
					@click="updatePassword()">{{
						saving? 'Saving...' : 'Save'	
					}}</button>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import config from '@/assets/config/config'
import axios from 'axios'

export default {
  name: "PasswordReset",
	props: ['safeCode'], 
  data() {
    return {
			newPassword: null,
			saving: false
    }
  },
	methods: {
		async updatePassword() {
			this.saving = true

			const res = await axios.post(`${config.server}/update-password`, {
				safeCode: this.safeCode,
				newPassword: this.newPassword
			})

			this.saving = false

			if (res.status === 200) {
				this.$emit('passwordResetComplete')
			} else if (res.status === 400) {
				this.$store.commit('setError', { errMsg: 'This password reset has expired' })
			} else if (res.status === 500) {
				this.$store.commit('setError', { errMsg: 'Network error. Please try again.' })
			}
		}
	}
}
</script>

<style lang="scss" scoped>
@import '@/assets/mixins/centerX';
@import '@/assets/mixins/centerXY';

#unclickable {
  z-index: 16000;
	position: absolute;
	top: 0; left: 0;
	background-color: #1B2435;
	width: 100vw;
	height: 100vh;
}

#main {
  @include centerXY;
  width: 500px;
  height: 400px;
  background-color: #1B2435;
	border: 2px solid white;
	border-radius: 15px;
	box-shadow: 0 0 5px 7px rgba(0, 0, 0, 0.2);
	.mailIcon {
		position: absolute;
		top: 30px;
		left: 30px;
		transform: scale(2);
	}
	.closeIcon {
		position: absolute;
		top: 30px;
		right: 30px;
		transform: scale(1.5);
		background-color: red;
		padding: 3px;
		border-radius: 100%;
		box-shadow: 0 0 5px 7px rgba(0, 0, 0, 0.2);
		cursor: pointer;
		&:hover {
			transition: .15s ease-in-out;
			transform: scale(1.55);
		}
	}
	h1 {
		margin-top: 100px;
	}
  p {
		color: rgba(255, 255, 255, 0.6);
    font-style: italic;
    font-size: 18px;
  }
	input {
		margin-top: 50px;
		width: 70%;
		padding: 5px;
		font-size: 20px;
		font-weight: bold;
		border-radius: 20px;
		border: none;
		text-align: center;
	}
	#actionButtons {
		@include centerX;
		bottom: 40px;
		button {
			padding: 5px 20px 5px 20px;
			border-radius: 10px;
			font-size: 20px;
			font-weight: bold;
			margin: 5px;
			border: 2px solid white;
			cursor: pointer;
			&:hover {
				transition: .15s ease-in-out;
				transform: scale(1.03);
			}
		}
		#verifyBtn {
			background: linear-gradient(rgb(0, 246, 53), rgb(0, 185, 15));
		}
		#resendBtn {
			background: linear-gradient(rgb(148, 0, 246), rgb(115, 3, 149));
		}
	}
}

.resendCodeDisabled {
	cursor: default !important;
	background: linear-gradient(rgb(194, 194, 194), rgb(109, 109, 109)) !important;
	&:hover {
		transform: none !important;
	}
}

// transition
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>