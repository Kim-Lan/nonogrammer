<template>
  <div>
    <UBanner icon="material-symbols:warning-rounded" title="This site is currently under development. Expected release in Spring 2027." />
    <UPageHero
      title="nonogrammer"
      description="A website to play nonograms, the grid logic puzzle game, online."
      :links="[{
        label: 'Play',
        to: '/puzzle',
        trailingIcon: 'i-lucide-arrow-right',
        size: 'xl',
      }]"
    />
  </div>
</template>
