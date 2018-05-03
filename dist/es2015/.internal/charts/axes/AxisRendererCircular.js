/**
 * Module, defining Axis Renderer for circular axes.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { AxisRenderer } from "./AxisRenderer";
import { AxisFillCircular } from "./AxisFillCircular";
import { GridCircular } from "./GridCircular";
import { AxisLabelCircular } from "./AxisLabelCircular";
import { registry } from "../../core/Registry";
import { percent } from "../../core/utils/Percent";
import * as $math from "../../core/utils/Math";
import * as $path from "../../core/rendering/Path";
import * as $utils from "../../core/utils/Utils";
import * as $type from "../../core/utils/Type";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A renderer for circular axis.
 */
var AxisRendererCircular = /** @class */ (function (_super) {
    __extends(AxisRendererCircular, _super);
    /**
     * Constructor.
     *
     * @param {Axis} axis Related axis
     */
    function AxisRendererCircular() {
        var _this = 
        // Init
        _super.call(this) || this;
        // axis.layout = "none"; // does not trigger redraw when size changes
        _this.layout = "none";
        _this.className = "AxisRendererCircular";
        _this.isMeasured = false;
        _this.startAngle = -90;
        _this.endAngle = 270;
        _this.width = percent(100);
        _this.height = percent(100);
        _this.radius = percent(100);
        _this.isMeasured = false;
        _this.grid.template.location = 0;
        _this.labels.template.location = 0;
        _this.labels.template.isMeasured = true;
        _this.labels.template.radius = 15;
        _this.ticks.template.location = 0;
        _this.ticks.template.pixelPerfect = false;
        _this.tooltipLocation = 0;
        _this.line.strokeOpacity = 0;
        _this.applyTheme();
        return _this;
    }
    /**
    * @ignore
    */
    AxisRendererCircular.prototype.setAxis = function (axis) {
        var _this = this;
        _super.prototype.setAxis.call(this, axis);
        axis.isMeasured = false;
        // modify x and y so that tooltip would always be on circle
        var tooltip = axis.tooltip;
        tooltip.adapter.add("dx", function (x, target) {
            var point = $utils.svgPointToSprite({ x: target.pixelX, y: target.pixelY }, _this);
            return _this.pixelRadius * Math.cos(Math.atan2(point.y, point.x)) - point.x;
        });
        tooltip.adapter.add("dy", function (y, target) {
            var point = $utils.svgPointToSprite({ x: target.pixelX, y: target.pixelY }, _this);
            return _this.pixelRadius * Math.sin(Math.atan2(point.y, point.x)) - point.y;
        });
    };
    /**
     * Validates Axis renderer.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     */
    AxisRendererCircular.prototype.validate = function () {
        // so that radius would be updated
        if (this.chart && this.chart.invalid) {
            this.chart.validate();
        }
        _super.prototype.validate.call(this);
    };
    Object.defineProperty(AxisRendererCircular.prototype, "axisLength", {
        /**
         * Returns actual length of the Axis, in pixels.
         *
         * @return {number} Length (px)
         */
        get: function () {
            return 2 * Math.PI * this.pixelRadius;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRendererCircular.prototype, "radius", {
        /**
         * Returns currently set outer radius.
         *
         * @return {number | Percent} Outer radius
         */
        get: function () {
            return this.getPropertyValue("radius");
        },
        /**
         * Sets outer radius of the axis.
         *
         * Can be absolute (px) or relative ([[Percent]]).
         *
         * @param {number | Percent}  value  Outer radius
         */
        set: function (value) {
            this.setPropertyValue("radius", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRendererCircular.prototype, "pixelRadius", {
        /**
         * Outer radius in pixels.
         *
         * @return {number} Outer radius (px)
         */
        get: function () {
            return $utils.relativeRadiusToValue(this.radius, $math.min(this.innerWidth / 2, this.innerHeight / 2));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRendererCircular.prototype, "innerRadius", {
        /**
         * Returns currently set inner radius.
         *
         * @return {number | Percent} Inner radius
         */
        get: function () {
            return this.getPropertyValue("innerRadius");
        },
        /**
         * Sets inner radius of the axis.
         *
         * Can be absolute (px) or relative ([[Percent]]).
         *
         * @param {number | Percent}  value  Inner radius
         */
        set: function (value) {
            this.setPropertyValue("innerRadius", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRendererCircular.prototype, "pixelInnerRadius", {
        /**
         * Inner radius in pixels.
         *
         * @return {number} Inner radius (px)
         */
        get: function () {
            return $utils.relativeRadiusToValue(this.innerRadius, $math.min(this.innerWidth / 2, this.innerHeight / 2)) || 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Converts relative position on axis to point coordinates.
     *
     * @param  {number}  position  Position (0-1)
     * @return {IPoint}            Point
     */
    AxisRendererCircular.prototype.positionToPoint = function (position) {
        var coordinate = this.positionToCoordinate(position);
        var angle = this.startAngle + (this.endAngle - this.startAngle) * coordinate / this.axisLength;
        return { x: this.pixelRadius * $math.cos(angle), y: this.pixelRadius * $math.sin(angle) };
    };
    /**
     * Converts relative position on axis to angle.
     *
     * @todo Description (units)
     * @param  {number}  position  Position (0-1)
     * @return {number}            Angle
     */
    AxisRendererCircular.prototype.positionToAngle = function (position) {
        var axis = this.axis;
        var arc = (this.endAngle - this.startAngle) / (axis.end - axis.start);
        var angle;
        if (axis.renderer.inversed) {
            angle = this.startAngle + (axis.end - position) * arc;
        }
        else {
            angle = this.startAngle + (position - axis.start) * arc;
        }
        return $math.round(angle, 3);
    };
    /**
     * Updates and positions the axis line element.
     *
     * @ignore Exclude from docs
     */
    AxisRendererCircular.prototype.updateAxisLine = function () {
        var element = this.line.element;
        // @todo Is this needed?
        this.chart;
        var radius = this.pixelRadius;
        var startAngle = this.startAngle;
        var endAngle = this.endAngle;
        var arc = endAngle - startAngle;
        element.attr({ "d": $path.moveTo({ x: radius * $math.cos(startAngle), y: radius * $math.sin(startAngle) }) + $path.arcTo(startAngle, arc, radius, radius) });
    };
    /**
     * Updates and positions a grid element.
     *
     * @ignore Exclude from docs
     * @param {Grid}    grid         Grid element
     * @param {number}  position     Starting position
     * @param {number}  endPosition  End position
     */
    AxisRendererCircular.prototype.updateGridElement = function (grid, position, endPosition) {
        position = position + (endPosition - position) * grid.location;
        var point = this.positionToPoint(position);
        if (grid.element) {
            var angle = $math.DEGREES * Math.atan2(point.y, point.x);
            var radius = $utils.relativeRadiusToValue($type.isNumber(grid.radius) ? grid.radius : this.radius, this.pixelRadius);
            var gridInnerRadius = $utils.relativeRadiusToValue(grid.innerRadius, this.pixelRadius);
            grid.zIndex = 0;
            var innerRadius = $utils.relativeRadiusToValue($type.isNumber(gridInnerRadius) ? gridInnerRadius : this.innerRadius, this.pixelRadius, true);
            grid.element.attr({ "d": $path.moveTo({ x: innerRadius * $math.cos(angle), y: innerRadius * $math.sin(angle) }) + $path.lineTo({ x: radius * $math.cos(angle), y: radius * $math.sin(angle) }) });
        }
        this.toggleVisibility(grid, position, 0, 1);
    };
    /**
     * Updates and positions a tick element.
     *
     * @ignore Exclude from docs
     * @param {AxisTick}  tick         Tick element
     * @param {number}    position     Starting position
     * @param {number}    endPosition  End position
     */
    AxisRendererCircular.prototype.updateTickElement = function (tick, position, endPosition) {
        position = position + (endPosition - position) * tick.location;
        var point = this.positionToPoint(position);
        if (tick.element) {
            var radius = this.pixelRadius;
            var angle = $math.DEGREES * Math.atan2(point.y, point.x);
            var tickLength = tick.length;
            if (tick.inside) {
                tickLength = -tickLength;
            }
            tick.zIndex = 1;
            tick.element.attr({ "d": $path.moveTo({ x: radius * $math.cos(angle), y: radius * $math.sin(angle) }) + $path.lineTo({ x: (radius + tickLength) * $math.cos(angle), y: (radius + tickLength) * $math.sin(angle) }) });
        }
        this.toggleVisibility(tick, position, 0, 1);
    };
    /**
     * Updates and positions a label element.
     *
     * @ignore Exclude from docs
     * @param {AxisLabel}  label        Label element
     * @param {number}     position     Starting position
     * @param {number}     endPosition  Ending position
     */
    AxisRendererCircular.prototype.updateLabelElement = function (label, position, endPosition) {
        position = position + (endPosition - position) * label.location;
        var point = this.positionToPoint(position);
        label.fixPoint(point, this.pixelRadius);
        label.zIndex = 2;
        this.positionItem(label, point);
        this.toggleVisibility(label, position, this.minLabelPosition, this.maxLabelPosition);
    };
    /**
     * Checks if point is within bounds of a container.
     *
     * @ignore Exclude from docs
     * @param  {IPoint}   point Point coordinates
     * @return {boolean}         Fits?
     */
    AxisRendererCircular.prototype.fitsToBounds = function (point) {
        return true;
    };
    Object.defineProperty(AxisRendererCircular.prototype, "startAngle", {
        /**
         * Returns currently set start angle.
         *
         * @todo Description (units)
         * @return {number} Start angle
         */
        get: function () {
            return this.getPropertyValue("startAngle");
        },
        /**
         * Sets start angle of the axis.
         *
         * @todo Description (units)
         * @param {number} value Start angle
         */
        set: function (value) {
            // do not normalize angel here!
            this.setPropertyValue("startAngle", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRendererCircular.prototype, "endAngle", {
        /**
         * Returns currently set end angle.
         *
         * @todo Description (units)
         * @return {number} End angle
         */
        get: function () {
            return this.getPropertyValue("endAngle");
        },
        /**
         * Sets end angle of the axis.
         *
         * @todo Description (units)
         * @param {number} value end angle
         */
        set: function (value) {
            // do not normalize angel here!
            this.setPropertyValue("endAngle", value, true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * [getPositionRangePath description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {number}  startPosition  Starting position
     * @param  {number}  endPosition    End position
     * @return {string}                 SVG path
     */
    AxisRendererCircular.prototype.getPositionRangePath = function (startPosition, endPosition, radius, innerRadius, cornerRadius) {
        var path = "";
        if ($type.isNumber(startPosition) && $type.isNumber(endPosition)) {
            if (!$type.hasValue(radius)) {
                radius = this.radius;
            }
            startPosition = $math.max(startPosition, this.axis.start);
            endPosition = $math.min(endPosition, this.axis.end);
            if (endPosition < startPosition) {
                endPosition = startPosition;
            }
            var pixelRadius = $utils.relativeRadiusToValue(radius, this.pixelRadius);
            var pixelInnerRadius = $utils.relativeRadiusToValue(innerRadius, this.pixelRadius, true);
            var startAngle = this.positionToAngle(startPosition);
            var endAngle = this.positionToAngle(endPosition);
            var arc = endAngle - startAngle;
            path = $path.arc(startAngle, arc, pixelRadius, pixelInnerRadius, pixelRadius, cornerRadius);
        }
        return path;
    };
    /**
     * Returns a new grid element, suitable for this Axis Renderer type.
     *
     * @return {GridCircular} Grid element
     */
    AxisRendererCircular.prototype.createGrid = function () {
        return new GridCircular();
    };
    /**
     * Returns a new fill element, suitable for this Axis Renderer type.
     *
     * @return {AxisFillCircular} Fill element
     */
    AxisRendererCircular.prototype.createFill = function (axis) {
        return new AxisFillCircular(axis);
    };
    /**
     * Returns a new label element, suitable for this Axis Renderer type.
     *
     * @return {AxisLabelCircular} Label element
     */
    AxisRendererCircular.prototype.createLabel = function () {
        return new AxisLabelCircular();
    };
    return AxisRendererCircular;
}(AxisRenderer));
export { AxisRendererCircular };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["AxisRendererCircular"] = AxisRendererCircular;
//# sourceMappingURL=AxisRendererCircular.js.map