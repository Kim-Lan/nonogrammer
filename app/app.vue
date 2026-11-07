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

const puzzleItems = [
  {
    label: 'Normal',
    children: [
      {
        label: '5x5',
        to: '/puzzles/normal/5x5',
      },
      {
        label: '10x10',
        to: '/puzzles/normal/10x10',
      },
      {
        label: '15x15',
        to: '/puzzles/normal/15x15',
      },
      {
        label: '20x20',
        to: '/puzzles/normal/20x20',
      },
      {
        label: '25x25',
        to: '/puzzles/normal/25x25',
      },
      {
        label: '30x30',
        to: '/puzzles/normal/30x30',
      },
    ],
  },
  {
    label: 'Hard',
    children: [
      {
        label: '5x5',
        to: '/puzzles/hard/5x5',
      },
      {
        label: '10x10',
        to: '/puzzles/hard/10x10',
      },
      {
        label: '15x15',
        to: '/puzzles/hard/15x15',
      },
      {
        label: '20x20',
        to: '/puzzles/hard/20x20',
      },
      {
        label: '25x25',
        to: '/puzzles/hard/25x25',
      },
      {
        label: '30x30',
        to: '/puzzles/hard/30x30',
      },
    ],
  },
];

const navItems = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Play',
    to: '/play',
  },
  {
    label: 'Puzzles',
    slot: 'puzzles',
    children: puzzleItems,
  },
  {
    label: 'Credits',
    to: '/credits',
  },
]);

function isPathActive(path: string): boolean {
  return route.path === path;
}
</script>

<template>
  <UApp>
    <UHeader class="relative z-60">
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
          content-orientation="vertical"
          class="hidden lg:flex justify-end"
          :ui="{
            list: 'gap-1',
            link: 'hover:before:bg-elevated data-[state=open]:before:bg-elevated',
            linkTrailingIcon: '-me-1',
            content: 'w-32 overflow-visible',
            viewport: 'overflow-visible',
          }"
        >
          <template #puzzles-content>
            <div class="flex flex-col p-1 gap-1">
              <UPopover
                v-for="item in puzzleItems"
                :key="item.label"
                mode="hover"
                :portal="false"
                :content="{
                  side: 'right',
                  align: 'start',
                  sideOffset: 0,
                }"
              >
                <template #default="{ open }">
                  <UButton
                    :label="item.label"
                    trailing-icon="i-lucide-chevron-right"
                    color="neutral"
                    variant="ghost"
                    block
                    :ui="{
                      base: [
                        'justify-between rounded-md px-3 py-2 font-medium text-muted',
                        open && 'bg-elevated text-highlighted',
                      ],
                    }"
                  />
                </template>

                <template #content>
                  <div class="flex min-w-24 flex-col p-1 gap-1">
                    <UButton
                      v-for="child in item.children"
                      :key="child.to"
                      :label="child.label"
                      :to="child.to"
                      :active="isPathActive(child.to)"
                      color="neutral"
                      active-color="primary"
                      variant="ghost"
                      active-class="bg-elevated"
                      block
                      :ui="{
                        base: `justify-start rounded-md px-3 py-2 font-medium hover:bg-elevated
                          ${isPathActive(child.to) ? 'hover:text-primary' : 'text-muted hover:text-highlighted'}`,
                      }"
                    />
                  </div>
                </template>
              </UPopover>
            </div>
          </template>
        </UNavigationMenu>

        <USeparator orientation="vertical" class="hidden lg:block h-10 mx-1" />

        <UColorModeButton />
      </template>

      <template #body>
        <UNavigationMenu
          :items="navItems"
          orientation="vertical"
          :ui="{
            list: 'flex flex-col gap-2',
            link: 'text-base',
            childList: 'mt-2 space-y-2',
          }"
        />
      </template>
    </UHeader>

    <UMain class="min-h-fit">
      <NuxtPage />
    </UMain>

    <USeparator />

    <UFooter
      :ui="{
        container: 'py-4',
        left: 'mt-1 lg:mt-0',
        center: 'mt-1 lg:mt-0',
      }"
    >
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
