<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui';

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
  ],
  htmlAttrs: {
    lang: 'en',
  },
});

const title = 'nonogrammer';
const description = 'A website to play nonograms, the grid logic puzzle game, online.';

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: '',
  twitterCard: 'summary_large_image',
});

const route = useRoute();

const navItems = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Play',
    to: '/puzzle',
    active: route.path.startsWith('/puzzle'),
    children: [
      {
        label: 'normal 5x5',
        to: '/puzzle/5x5/normal',
      },
      {
        label: 'hard 5x5',
        to: '/puzzle/5x5/hard',
      },
      {
        label: 'normal 10x10',
        to: '/puzzle/10x10/normal',
      },
      {
        label: 'hard 10x10',
        to: '/puzzle/10x10/hard',
      },
      {
        label: 'normal 15x15',
        to: '/puzzle/15x15/normal',
      },
      {
        label: 'hard 15x15',
        to: '/puzzle/15x15/hard',
      },
      {
        label: 'normal 20x20',
        to: '/puzzle/20x20/normal',
      },
      {
        label: 'hard 20x20',
        to: '/puzzle/20x20/hard',
      },
      {
        label: 'normal 25x25',
        to: '/puzzle/25x25/normal',
      },
      {
        label: 'hard 25x25',
        to: '/puzzle/25x25/hard',
      },
      {
        label: 'normal 30x30',
        to: '/puzzle/30x30/normal',
      },
      {
        label: 'hard 30x30',
        to: '/puzzle/30x30/hard',
      },
    ],
  },
  {
    label: 'Credits',
    to: '/credits',
    active: route.path.startsWith('/credits'),
  },
]);
</script>

<template>
  <UApp>
    <UHeader class="relative z-50">
      <template #left>
        <NuxtLink
          to="/"
          class="focus-visible:outline-3 outline-primary/25 rounded-md p-1 -ms-1"
        >
          <AppLogo />
        </NuxtLink>
      </template>

      <template #right>
        <UNavigationMenu
          :items="navItems"
          class="hidden lg:flex w-80 justify-end"
        />

        <USeparator orientation="vertical" class="hidden lg:block h-10 mx-1" />

        <UColorModeButton />
      </template>

      <template #body>
        <UNavigationMenu
          :items="navItems"
          orientation="vertical"
        />
      </template>
    </UHeader>

    <UMain class="min-h-fit">
      <NuxtPage />
    </UMain>

    <USeparator />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Developed by Kim-Lan • © {{ new Date().getFullYear() }}
        </p>
      </template>

      <template #right>
        <UButton
          to="https://ko-fi.com/kimlan"
          target="_blank"
          icon="i-simple-icons-kofi"
          aria-label="Ko-fi"
          color="neutral"
          variant="ghost"
        />
        <UButton
          to="https://github.com/Kim-Lan/nonogrammer"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UFooter>
  </UApp>
</template>
