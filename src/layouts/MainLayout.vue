<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="header-tone">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="brand-title">
          Sistema de Coleta de Lixo
        </q-toolbar-title>

        <q-btn
          flat
          dense
          round
          icon="account_circle"
          aria-label="Menu do usuário"
        >
          <q-menu>
            <q-list style="min-width: 220px">
              <q-item-label header>Acesso rápido</q-item-label>
              <q-item
                v-for="item in userMenuItems"
                :key="item.to"
                clickable
                :to="item.to"
                v-close-popup
              >
                <q-item-section avatar>
                  <q-icon :name="item.icon" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ item.label }}</q-item-label>
                  <q-item-label caption>{{ item.caption }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="app-drawer"
    >
      <q-list>
        <q-item-label header>Menu principal</q-item-label>

        <q-item
          v-for="item in menuItems"
          :key="item.to"
          clickable
          :to="item.to"
          :exact="item.to === '/'"
          class="menu-item"
          active-class="menu-active"
          v-ripple
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ item.label }}</q-item-label>
            <q-item-label caption>{{ item.caption }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const menuItems = [
  { to: '/', icon: 'dashboard', label: 'Início', caption: 'Visão geral das solicitações' },
  { to: '/mapa', icon: 'map', label: 'Mapa de pontos', caption: 'Pontos próximos no mapa' },
  { to: '/protocolos', icon: 'fact_check', label: 'Protocolos abertos', caption: 'Acompanhamento de status' },
  { to: '/guia', icon: 'menu_book', label: 'Guia de descarte', caption: 'Como descartar corretamente' }
]

const userMenuItems = [
  { to: '/conta', icon: 'person_add', label: 'Criar conta', caption: 'Cadastro de usuário' },
  { to: '/notificacoes', icon: 'notifications', label: 'Notificações', caption: 'Acompanhar avisos' },
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style scoped>
.header-tone {
  background: linear-gradient(120deg, #0d5e4f 0%, #0f7662 56%, #1f8fd1 100%);
}

.brand-title {
  font-weight: 700;
  letter-spacing: 0.015em;
}

.app-drawer {
  background: linear-gradient(180deg, #f7fbfb 0%, #eef5f4 100%);
}

.menu-item {
  border-radius: 12px;
  margin: 4px 8px;
}

.menu-item :deep(.q-item__label--caption) {
  color: #516b74;
}

.menu-active {
  background: linear-gradient(90deg, rgba(15, 118, 98, 0.16) 0%, rgba(31, 143, 209, 0.14) 100%);
}
</style>
