<script setup lang="ts">
import { onMounted } from "vue";
import Sidebar from "../../../components/Sidebar.vue";
import WorksCard from "../../../components/WorksCard.vue";
import { useAnimeWorks } from "../../../stores/animeWorks";
import { updateSEO } from "../../../utils/seo";

const animeWorks = useAnimeWorks();

onMounted(() => {
	updateSEO("history");
	animeWorks.getAnimeData().then(() => {
		animeWorks.getWatchHistory();
	});
});
</script>

<template>
	<Sidebar></Sidebar>
	<div class="main">
		<div class="content">
			<WorksCard :from-Page="2"></WorksCard>
		</div>
	</div>
</template>

<style lang="scss">
.history-login-prompt {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: calc(100vh - 120px);
	padding: 20px;

	.login-card {
		background: var(--sidebar-background-color);
		border-radius: 16px;
		padding: 48px 40px;
		max-width: 420px;
		width: 100%;
		text-align: center;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		transition: all 0.3s ease;

		&:hover {
			transform: translateY(-4px);
			box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
		}

		.login-icon {
			margin-bottom: 24px;
			color: var(--sidebar-li-text-color);
			opacity: 0.8;

			svg {
				filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
			}
		}

		.login-title {
			font-size: 28px;
			font-weight: 700;
			margin: 0 0 12px 0;
			color: var(--text-default-color);
			letter-spacing: 2px;
			font-family: "Noto Sans JP", sans-serif;
		}

		.login-subtitle {
			font-size: 16px;
			color: var(--text-default-color);
			opacity: 0.8;
			margin: 0 0 32px 0;
			line-height: 1.6;
			font-weight: 500;
		}

		.login-description {
			text-align: left;
			margin-bottom: 32px;

			p {
				font-size: 14px;
				color: var(--text-default-color);
				opacity: 0.9;
				margin: 0 0 16px 0;
				font-weight: 600;
			}

			ul {
				list-style: none;
				padding: 0;
				margin: 0;

				li {
					font-size: 14px;
					color: var(--text-default-color);
					opacity: 0.8;
					padding: 8px 0;
					padding-left: 24px;
					position: relative;
					line-height: 1.5;

					&::before {
						content: "✓";
						position: absolute;
						left: 0;
						color: var(--sidebar-li-text-color);
						font-weight: bold;
						font-size: 16px;
					}
				}
			}
		}

		.login-button {
			background: linear-gradient(135deg, var(--sidebar-li-text-color), #2563eb);
			color: white;
			border: none;
			border-radius: 12px;
			padding: 16px 32px;
			font-size: 16px;
			font-weight: 600;
			cursor: pointer;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 8px;
			transition: all 0.3s ease;
			box-shadow: 0 4px 16px rgba(29, 80, 162, 0.3);
			position: relative;
			overflow: hidden;

			&::before {
				content: "";
				position: absolute;
				top: 0;
				left: -100%;
				width: 100%;
				height: 100%;
				background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
				transition: left 0.5s;
			}

			&:hover {
				transform: translateY(-2px);
				box-shadow: 0 8px 24px rgba(29, 80, 162, 0.4);

				&::before {
					left: 100%;
				}
			}

			&:active {
				transform: translateY(0);
				transition: transform 0.1s;
			}

			svg {
				filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
			}
		}
	}
}

// 響應式設計
@media (max-width: 768px) {
	.history-login-prompt {
		padding: 16px;
		min-height: calc(100vh - 100px);

		.login-card {
			padding: 32px 24px;
			max-width: 100%;

			.login-title {
				font-size: 24px;
				letter-spacing: 1.5px;
			}

			.login-subtitle {
				font-size: 15px;
			}

			.login-description {
				margin-bottom: 24px;

				ul li {
					font-size: 13px;
					padding: 6px 0;
				}
			}

			.login-button {
				padding: 14px 24px;
				font-size: 15px;
			}
		}
	}
}

// 深色模式適配
html[data-theme="dark"] {
	.history-login-prompt .login-card {
		background: var(--sidebar-background-color);
		border-color: rgba(255, 255, 255, 0.05);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

		&:hover {
			box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
		}

		.login-button {
			box-shadow: 0 4px 16px rgba(255, 255, 255, 0.1);

			&:hover {
				box-shadow: 0 8px 24px rgba(255, 255, 255, 0.15);
			}
		}
	}
}
</style>
