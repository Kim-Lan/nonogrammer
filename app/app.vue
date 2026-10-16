<script lang="ts" setup>
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

const title = 'Nonogrammer';
const description = 'A website to play Nonograms, the grid logic puzzle game, online.';

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: '',
  twitterCard: 'summary_large_image',
});

const route = useRoute();

const navItems = computed<NavigationMenuItem[]>(() => [{
  label: 'Play',
  to: '/puzzle',
  active: route.path.startsWith('/puzzle'),
}]);
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink
          to="/"
          class="focus-visible:outline-3 outline-primary/25 rounded-md p-1 -ms-1"
        >
          <AppLogo />
        </NuxtLink>
      </template>

      <template #right>
        <UNavigationMenu :items="navItems" />

        <USeparator orientation="vertical" class="h-10 mx-1" />

        <UColorModeButton />
      </template>

      <template #body>
        <UNavigationMenu :items="navItems" orientation="vertical" class="-mx-2.5" />
      </template>
    </UHeader>

    <UMain class="min-h-(--ui-main-height)">
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
