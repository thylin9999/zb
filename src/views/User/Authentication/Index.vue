<template>
    <div>

    </div>
</template>

<script>
export default {
    name: 'PersonalInfo',

    data () {
        return {
            currentStep: 1,
            steps: [
                {
                    id: 1,
                    icon: 'my/apply/id'
                },
                {
                    id: 2,
                    icon: 'my/apply/info'
                },
                {
                    id: 3,
                    icon: 'my/apply/result'
                }
            ]
        }
    }
}

</script>

<style lang="scss" scoped>

</style>
