<template>
    <div
        class='flex items-center justify-center min-h-screen from-gray-800 via-greeen-300 to-blue-500 bg-gradient-to-br'>
        <div class='w-full max-w-lg px-10 py-8 mx-auto bg-white rounded-lg shadow-xl'>
            <div class='max-w-md mx-auto space-y-6'>
                <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                    <div class="mx-auto max-w-screen-sm text-center">
                        <h1
                            class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
                            {{ code }}
                        </h1>
                        <p class="mb-4 text-3xl tracking-tight font-bold text-black md:text-4xl"> 
                            {{ message }}
                        </p>
                        <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">We are already working to
                            solve the problem. 
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
const route = useRoute();
const code = route.params.code;
const message = route.params.message;
</script>

<style scoped lang="scss"></style>